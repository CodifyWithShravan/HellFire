import os
import uvicorn
import requests
import yfinance as yf
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Optional
import json
import re

# Load environment variables
load_dotenv()

app = FastAPI(title="MarketAI Suite API", version="2.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq Client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

# ==================== PYDANTIC MODELS ====================

# Campaign Generator Models
class CampaignRequest(BaseModel):
    product_name: str
    product_description: str
    target_audience: str
    platform: str  # LinkedIn, Twitter, Facebook, Instagram

class ContentIdea(BaseModel):
    title: str
    description: str
    content_type: str  # post, video, carousel, story, article

class AdCopy(BaseModel):
    headline: str
    body: str
    variation_focus: str  # pain_point, benefit, urgency

class CampaignResponse(BaseModel):
    product_name: str
    platform: str
    campaign_objectives: List[str]
    content_ideas: List[ContentIdea]
    ad_copies: List[AdCopy]
    cta_suggestions: List[str]

# Pitch Generator Models
class PitchRequest(BaseModel):
    product_name: str
    product_description: str
    prospect_role: str
    prospect_company: str
    company_size: str  # Startup, SMB, Mid-Market, Enterprise

class PitchResponse(BaseModel):
    product_name: str
    prospect_info: str
    elevator_pitch: str
    value_proposition: str
    differentiators: List[str]
    strategic_cta: str

# Lead Scorer Models
class LeadRequest(BaseModel):
    lead_name: str
    company: str
    budget: str
    timeline: str
    urgency: str
    decision_authority: str
    need_fit: str

class LeadResponse(BaseModel):
    lead_name: str
    company: str
    score: int  # 0-100
    score_breakdown: dict
    reasoning: str
    conversion_probability: str
    recommended_action: str

# ==================== HELPER FUNCTIONS ====================

def parse_json_response(response_text: str) -> dict:
    """Clean and parse JSON from LLM response"""
    text = response_text.strip()
    # Remove markdown code blocks
    if text.startswith("```"):
        text = re.sub(r'^```json?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)
    return json.loads(text)

def generate_with_groq(prompt: str, max_tokens: int = 2000) -> str:
    """Generate response using Groq LLaMA 3.3 70B"""
    completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
        temperature=0.7,
        max_tokens=max_tokens,
    )
    return completion.choices[0].message.content.strip()

# ==================== API ENDPOINTS ====================

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "MarketAI Suite API",
        "version": "2.0.0",
        "endpoints": ["/campaign", "/pitch", "/score"]
    }

@app.post("/campaign", response_model=CampaignResponse)
async def generate_campaign(request: CampaignRequest):
    """Generate AI-powered marketing campaign"""
    
    if not request.product_name.strip():
        raise HTTPException(status_code=400, detail="Product name is required")
    
    prompt = f"""You are a senior marketing strategist with 15+ years experience in digital marketing.
Create a comprehensive marketing campaign for the following:

PRODUCT: {request.product_name}
DESCRIPTION: {request.product_description}
TARGET AUDIENCE: {request.target_audience}
PLATFORM: {request.platform}

Generate a complete marketing strategy with:
1. 3 clear campaign objectives aligned with {request.platform}
2. 5 targeted content ideas (mix of posts, videos, carousels, stories, articles as appropriate)
3. 3 variations of compelling ad copy (focus on: pain_point, benefit, urgency)
4. 4 specific call-to-action suggestions tailored to {request.platform}'s audience behavior

RESPOND IN THIS EXACT JSON FORMAT:
{{
    "campaign_objectives": ["objective1", "objective2", "objective3"],
    "content_ideas": [
        {{"title": "Content Title", "description": "What this content covers", "content_type": "post/video/carousel/story/article"}}
    ],
    "ad_copies": [
        {{"headline": "Attention-grabbing headline", "body": "The ad body text", "variation_focus": "pain_point/benefit/urgency"}}
    ],
    "cta_suggestions": ["CTA 1", "CTA 2", "CTA 3", "CTA 4"]
}}

IMPORTANT: Respond ONLY with valid JSON. No explanations outside the JSON."""

    try:
        response_text = generate_with_groq(prompt)
        result = parse_json_response(response_text)
        
        return CampaignResponse(
            product_name=request.product_name,
            platform=request.platform,
            campaign_objectives=result.get("campaign_objectives", []),
            content_ideas=[ContentIdea(**idea) for idea in result.get("content_ideas", [])[:5]],
            ad_copies=[AdCopy(**copy) for copy in result.get("ad_copies", [])[:3]],
            cta_suggestions=result.get("cta_suggestions", [])
        )
    except json.JSONDecodeError:
        # Fallback response
        return CampaignResponse(
            product_name=request.product_name,
            platform=request.platform,
            campaign_objectives=[
                f"Increase brand awareness for {request.product_name} on {request.platform}",
                f"Drive qualified leads from {request.target_audience}",
                "Boost engagement and conversions by 25%"
            ],
            content_ideas=[
                ContentIdea(title="Product Introduction", description=f"Introduce {request.product_name} to your audience", content_type="post"),
                ContentIdea(title="Customer Success Story", description="Showcase real results from users", content_type="video"),
                ContentIdea(title="Behind the Scenes", description="Show the team and process", content_type="story"),
                ContentIdea(title="Tips & Tricks", description="Educational content related to your product", content_type="carousel"),
                ContentIdea(title="Industry Insights", description="Thought leadership article", content_type="article")
            ],
            ad_copies=[
                AdCopy(headline=f"Struggling with productivity?", body=f"{request.product_name} helps teams work smarter. Join 10,000+ satisfied users.", variation_focus="pain_point"),
                AdCopy(headline=f"Transform your workflow today", body=f"See why leaders choose {request.product_name}. Start free.", variation_focus="benefit"),
                AdCopy(headline=f"Limited time: 30% off", body=f"Don't miss out on {request.product_name}. Offer ends soon.", variation_focus="urgency")
            ],
            cta_suggestions=["Start Free Trial", "Book a Demo", "Learn More", "Get Started Today"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@app.post("/pitch", response_model=PitchResponse)
async def generate_pitch(request: PitchRequest):
    """Generate intelligent sales pitch"""
    
    if not request.product_name.strip():
        raise HTTPException(status_code=400, detail="Product name is required")
    
    prompt = f"""You are a world-class B2B sales expert who has closed deals with Fortune 500 companies.
Create a personalized, compelling sales pitch for the following scenario:

PRODUCT: {request.product_name}
DESCRIPTION: {request.product_description}
PROSPECT ROLE: {request.prospect_role}
PROSPECT COMPANY: {request.prospect_company}
COMPANY SIZE: {request.company_size}

Generate:
1. A concise 30-second elevator pitch (max 75 words) - conversational, not salesy
2. A clear value proposition (2-3 sentences)
3. 3 key differentiators that address {request.company_size} company pain points
4. A strategic call-to-action to move the prospect to the next sales stage

RESPOND IN THIS EXACT JSON FORMAT:
{{
    "elevator_pitch": "Your 30-second pitch here...",
    "value_proposition": "Clear value statement...",
    "differentiators": [
        "Differentiator 1 addressing specific pain point",
        "Differentiator 2 with competitive advantage",
        "Differentiator 3 with unique benefit"
    ],
    "strategic_cta": "Next step action..."
}}

IMPORTANT: Respond ONLY with valid JSON. No explanations outside the JSON."""

    try:
        response_text = generate_with_groq(prompt)
        result = parse_json_response(response_text)
        
        return PitchResponse(
            product_name=request.product_name,
            prospect_info=f"{request.prospect_role} at {request.prospect_company} ({request.company_size})",
            elevator_pitch=result.get("elevator_pitch", ""),
            value_proposition=result.get("value_proposition", ""),
            differentiators=result.get("differentiators", [])[:3],
            strategic_cta=result.get("strategic_cta", "")
        )
    except json.JSONDecodeError:
        # Fallback response
        return PitchResponse(
            product_name=request.product_name,
            prospect_info=f"{request.prospect_role} at {request.prospect_company} ({request.company_size})",
            elevator_pitch=f"Hi, I work with {request.company_size} companies like {request.prospect_company} who struggle with efficiency. {request.product_name} helps teams like yours reduce manual work by 40% while improving output quality. Would you be open to a quick 15-minute call to explore if this could work for you?",
            value_proposition=f"{request.product_name} delivers enterprise-grade capabilities with the simplicity your team needs. We help organizations achieve measurable ROI within 90 days.",
            differentiators=[
                f"Purpose-built for {request.company_size} companies with scalable architecture",
                "24/7 dedicated support with average 15-minute response time",
                "Seamless integration with your existing tech stack in under 2 hours"
            ],
            strategic_cta=f"I'd love to show you a personalized demo tailored to {request.prospect_company}'s specific needs. Do you have 20 minutes this week?"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


@app.post("/score", response_model=LeadResponse)
async def score_lead(request: LeadRequest):
    """Score and qualify a sales lead"""
    
    if not request.lead_name.strip():
        raise HTTPException(status_code=400, detail="Lead name is required")
    
    prompt = f"""You are a senior sales operations analyst specializing in lead qualification and scoring.
Analyze this lead and provide a comprehensive qualification assessment:

LEAD INFORMATION:
- Name: {request.lead_name}
- Company: {request.company}
- Budget: {request.budget}
- Timeline: {request.timeline}
- Urgency: {request.urgency}
- Decision Authority: {request.decision_authority}
- Need/Fit: {request.need_fit}

Score this lead using BANT+F methodology (Budget, Authority, Need, Timeline + Fit).
Provide:
1. An overall score from 0-100
2. Individual scores for each dimension (0-20 each)
3. Detailed reasoning for the score
4. Conversion probability (Low/Medium/High/Very High)
5. Recommended next action

RESPOND IN THIS EXACT JSON FORMAT:
{{
    "score": 85,
    "score_breakdown": {{
        "budget": 18,
        "authority": 16,
        "need": 19,
        "timeline": 17,
        "fit": 15
    }},
    "reasoning": "Detailed analysis of why this lead received this score...",
    "conversion_probability": "High",
    "recommended_action": "Specific action to take with this lead..."
}}

IMPORTANT: Respond ONLY with valid JSON. Base scores on the actual input values provided."""

    try:
        response_text = generate_with_groq(prompt)
        result = parse_json_response(response_text)
        
        return LeadResponse(
            lead_name=request.lead_name,
            company=request.company,
            score=min(100, max(0, result.get("score", 50))),
            score_breakdown=result.get("score_breakdown", {}),
            reasoning=result.get("reasoning", ""),
            conversion_probability=result.get("conversion_probability", "Medium"),
            recommended_action=result.get("recommended_action", "")
        )
    except json.JSONDecodeError:
        # Calculate a basic score based on inputs
        score = 50
        breakdown = {"budget": 10, "authority": 10, "need": 10, "timeline": 10, "fit": 10}
        
        # Adjust based on inputs
        if "high" in request.urgency.lower() or "immediate" in request.timeline.lower():
            score += 15
            breakdown["timeline"] = 17
        if "decision maker" in request.decision_authority.lower() or "final" in request.decision_authority.lower():
            score += 15
            breakdown["authority"] = 18
        if "strong" in request.need_fit.lower() or "high" in request.need_fit.lower():
            score += 10
            breakdown["need"] = 16
            breakdown["fit"] = 16
        if "$" in request.budget and any(c.isdigit() for c in request.budget):
            score += 10
            breakdown["budget"] = 15
        
        score = min(100, score)
        prob = "Low" if score < 40 else "Medium" if score < 60 else "High" if score < 80 else "Very High"
        
        return LeadResponse(
            lead_name=request.lead_name,
            company=request.company,
            score=score,
            score_breakdown=breakdown,
            reasoning=f"Based on the provided information, {request.lead_name} from {request.company} shows {prob.lower()} conversion potential. Budget: {request.budget}, Timeline: {request.timeline}, Urgency: {request.urgency}.",
            conversion_probability=prob,
            recommended_action="Schedule a discovery call to further qualify this lead and understand their specific requirements."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")


# ==================== COMPANY INTEL (BATTLECARD) ====================

# Company Intel Models
class CompanyIntelRequest(BaseModel):
    company_name: str

class NewsItem(BaseModel):
    headline: str
    sentiment: str
    source: Optional[str] = None

class FinancialHealth(BaseModel):
    stock_price: str
    market_cap: str
    change_52w: str
    sector: str
    health_score: str

class Strategy(BaseModel):
    approach: str
    pitch_points: List[str]
    reasoning: str

class CompanyIntelResponse(BaseModel):
    company_name: str
    financial_health: FinancialHealth
    news: List[NewsItem]
    strategy: Strategy
    cold_email: str

def get_financial_data(company_name: str) -> dict:
    """Fetch financial data from Yahoo Finance"""
    ticker_map = {
        "tesla": "TSLA", "apple": "AAPL", "google": "GOOGL", "alphabet": "GOOGL",
        "microsoft": "MSFT", "amazon": "AMZN", "meta": "META", "facebook": "META",
        "nvidia": "NVDA", "netflix": "NFLX", "tcs": "TCS.NS", "infosys": "INFY.NS",
        "wipro": "WIPRO.NS", "reliance": "RELIANCE.NS",
    }
    
    company_lower = company_name.lower().strip()
    ticker_symbol = ticker_map.get(company_lower, company_name.upper()[:4])
    
    try:
        ticker = yf.Ticker(ticker_symbol)
        info = ticker.info
        
        price = info.get('regularMarketPrice') or info.get('currentPrice', 'N/A')
        market_cap = info.get('marketCap', 0)
        week_52_change = info.get('52WeekChange', 0)
        sector = info.get('sector', 'Technology')
        
        if market_cap and market_cap != 'N/A':
            if market_cap >= 1e12:
                market_cap_str = f"${market_cap/1e12:.2f}T"
            elif market_cap >= 1e9:
                market_cap_str = f"${market_cap/1e9:.2f}B"
            else:
                market_cap_str = f"${market_cap/1e6:.2f}M"
        else:
            market_cap_str = "N/A"
        
        change_str = f"{week_52_change*100:+.1f}%" if week_52_change else "N/A"
        
        if week_52_change and week_52_change > 0.2:
            health = "Strong"
        elif week_52_change and week_52_change > 0:
            health = "Stable"
        elif week_52_change and week_52_change > -0.2:
            health = "Moderate"
        else:
            health = "At Risk"
        
        return {
            "stock_price": f"${price}" if price != 'N/A' else "N/A",
            "market_cap": market_cap_str,
            "change_52w": change_str,
            "sector": sector,
            "health_score": health,
        }
    except:
        return {"stock_price": "N/A", "market_cap": "N/A", "change_52w": "N/A", "sector": "Technology", "health_score": "Unknown"}

def get_news_headlines(company_name: str) -> List[dict]:
    """Fetch news headlines for the company"""
    try:
        if NEWS_API_KEY:
            url = f"https://newsapi.org/v2/everything?q={company_name}&sortBy=publishedAt&pageSize=3&apiKey={NEWS_API_KEY}"
            response = requests.get(url, timeout=10)
            articles = response.json().get('articles', [])[:3]
            return [{"headline": a.get('title', ''), "source": a.get('source', {}).get('name', '')} for a in articles]
    except:
        pass
    return [
        {"headline": f"Latest updates on {company_name}", "source": "Market News"},
        {"headline": f"{company_name} industry trends", "source": "Business Wire"},
        {"headline": f"Analyst insights on {company_name}", "source": "Reuters"}
    ]

@app.post("/intel", response_model=CompanyIntelResponse)
async def get_company_intel(request: CompanyIntelRequest):
    """Generate Company Intelligence BattleCard"""
    
    company_name = request.company_name.strip()
    if not company_name:
        raise HTTPException(status_code=400, detail="Company name is required")
    
    financial_data = get_financial_data(company_name)
    headlines = get_news_headlines(company_name)
    
    headlines_text = "\n".join([f"- {h['headline']}" for h in headlines])
    
    prompt = f"""You are a Senior Sales Director analyzing this company for a sales approach.

COMPANY: {company_name}
FINANCIAL DATA: Stock: {financial_data['stock_price']}, Market Cap: {financial_data['market_cap']}, 52W Change: {financial_data['change_52w']}, Sector: {financial_data['sector']}

RECENT NEWS:
{headlines_text}

Generate:
1. Sentiment for each headline (positive/negative/neutral)
2. Strategic approach: "cost_optimization" if challenges detected, "scaling_growth" if growth signals
3. Brief reasoning for approach
4. 3 tactical pitch points
5. Short personalized cold email opener (2-3 sentences)

RESPOND IN EXACT JSON:
{{
    "news_sentiments": [{{"headline": "...", "sentiment": "positive/negative/neutral"}}],
    "approach": "cost_optimization" or "scaling_growth",
    "reasoning": "Brief explanation...",
    "pitch_points": ["Point 1", "Point 2", "Point 3"],
    "cold_email": "Email opener..."
}}"""

    try:
        response_text = generate_with_groq(prompt, 1000)
        result = parse_json_response(response_text)
        
        news_items = [NewsItem(headline=n.get("headline", ""), sentiment=n.get("sentiment", "neutral"), 
                               source=next((h["source"] for h in headlines if h["headline"] == n.get("headline")), None))
                     for n in result.get("news_sentiments", [])]
        
        if not news_items:
            news_items = [NewsItem(headline=h["headline"], sentiment="neutral", source=h.get("source")) for h in headlines]
        
        return CompanyIntelResponse(
            company_name=company_name.title(),
            financial_health=FinancialHealth(**financial_data),
            news=news_items,
            strategy=Strategy(
                approach=result.get("approach", "scaling_growth"),
                pitch_points=result.get("pitch_points", []),
                reasoning=result.get("reasoning", "")
            ),
            cold_email=result.get("cold_email", "")
        )
    except:
        return CompanyIntelResponse(
            company_name=company_name.title(),
            financial_health=FinancialHealth(**financial_data),
            news=[NewsItem(headline=h["headline"], sentiment="neutral", source=h.get("source")) for h in headlines],
            strategy=Strategy(
                approach="scaling_growth",
                pitch_points=["Accelerate digital transformation", "Unlock new revenue streams", "Outpace competitors"],
                reasoning=f"Based on {company_name}'s market position, a growth-focused approach is recommended."
            ),
            cold_email=f"I noticed {company_name} is making strategic moves. Our solution has helped similar companies achieve 40% faster time-to-value. Worth a quick chat?"
        )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)