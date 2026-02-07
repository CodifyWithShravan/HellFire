'use client';

import { useState } from 'react';
import {
    Building2,
    Radio,
    TrendingUp,
    Target,
    Mail,
    Copy,
    Check,
    AlertCircle,
    Loader2
} from 'lucide-react';

interface NewsItem {
    headline: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    source?: string;
}

interface FinancialHealth {
    stock_price: string;
    market_cap: string;
    change_52w: string;
    sector: string;
    health_score: string;
}

interface Strategy {
    approach: 'cost_optimization' | 'scaling_growth';
    pitch_points: string[];
    reasoning: string;
}

interface ProductFit {
    score: number;
    verdict: string;
    reasons: string[];
    suggested_angle: string;
}

interface CompanyIntelResult {
    company_name: string;
    financial_health: FinancialHealth;
    news: NewsItem[];
    strategy: Strategy;
    cold_email: string;
    product_fit?: ProductFit;
}

const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
        case 'positive': return 'badge-positive';
        case 'negative': return 'badge-negative';
        default: return 'badge-neutral';
    }
};

const getHealthColor = (health: string) => {
    switch (health) {
        case 'Strong': return 'text-emerald-400';
        case 'Stable': return 'text-cyan-400';
        case 'Moderate': return 'text-amber-400';
        case 'At Risk': return 'text-red-400';
        default: return 'text-slate-400';
    }
};

export default function CompanyIntel() {
    const [companyName, setCompanyName] = useState('');
    const [productContext, setProductContext] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CompanyIntelResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyName.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/intel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_name: companyName.trim(),
                    product_context: productContext.trim() || null
                }),
            });

            if (!response.ok) throw new Error('Failed to fetch company intel');
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError('Unable to fetch company intelligence. Please ensure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyEmail = () => {
        if (result?.cold_email) {
            navigator.clipboard.writeText(result.cold_email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-8">
            {/* Search Form */}
            <form onSubmit={handleSubmit} className="glass-card p-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Enter company name (e.g., Tesla, Microsoft, TCS)..."
                            className="war-room-input w-full pl-12"
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !companyName.trim()}
                        className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Target className="w-5 h-5" />
                                Generate Intel
                            </>
                        )}
                    </button>
                </div>

                {/* Optional: Your Product for Fit Analysis */}
                <div className="relative">
                    <input
                        type="text"
                        value={productContext}
                        onChange={(e) => setProductContext(e.target.value)}
                        placeholder="Optional: Your product (e.g., AI Sales Tool) for fit analysis..."
                        className="war-room-input w-full pl-4 pr-12 text-sm"
                        disabled={loading}
                    />
                    {productContext && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-amber-400">
                            ✨ Fit Analysis ON
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setCompanyName('Apple');
                        setProductContext('AI Sales Automation Tool');
                    }}
                    className="text-sm text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
                >
                    ✨ Try Example (Apple + AI Sales Tool)
                </button>
            </form>

            {/* Error */}
            {error && (
                <div className="glass-card p-4 border-red-500/30 animate-slide-up">
                    <div className="flex items-center gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* Results */}
            {result && (
                <div className="space-y-6 animate-fade-in">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-slate-100 mb-2">{result.company_name}</h2>
                        <div className="flex items-center justify-center gap-4 text-sm">
                            <span className={`badge ${result.strategy.approach === 'scaling_growth' ? 'badge-positive' : 'badge-amber'}`}>
                                {result.strategy.approach === 'scaling_growth' ? '📈 Growth Mode' : '⚡ Optimization Mode'}
                            </span>
                            <span className="text-slate-500">|</span>
                            <span className="text-slate-400">{result.financial_health.sector}</span>
                        </div>
                    </div>

                    {/* Product Fit Analysis - Only shown when product_context was provided */}
                    {result.product_fit && (
                        <div className="glass-card p-6 border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-transparent animate-scale-in">
                            <div className="flex items-start gap-4">
                                {/* Fit Score Circle */}
                                <div className={`flex-shrink-0 w-20 h-20 rounded-full flex flex-col items-center justify-center ${result.product_fit.score >= 8 ? 'bg-emerald-500/20 border-2 border-emerald-500/50' :
                                        result.product_fit.score >= 6 ? 'bg-cyan-500/20 border-2 border-cyan-500/50' :
                                            result.product_fit.score >= 4 ? 'bg-amber-500/20 border-2 border-amber-500/50' :
                                                'bg-red-500/20 border-2 border-red-500/50'
                                    }`}>
                                    <span className={`text-2xl font-bold ${result.product_fit.score >= 8 ? 'text-emerald-400' :
                                            result.product_fit.score >= 6 ? 'text-cyan-400' :
                                                result.product_fit.score >= 4 ? 'text-amber-400' :
                                                    'text-red-400'
                                        }`}>{result.product_fit.score}/10</span>
                                    <span className="text-xs text-slate-500">Fit Score</span>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-lg font-bold text-slate-100">Product Fit Analysis</h3>
                                        <span className={`badge ${result.product_fit.verdict.includes('Excellent') ? 'badge-positive' :
                                                result.product_fit.verdict.includes('Good') ? 'bg-cyan-500/20 text-cyan-400' :
                                                    result.product_fit.verdict.includes('Moderate') ? 'badge-amber' :
                                                        'badge-negative'
                                            }`}>
                                            {result.product_fit.verdict}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {result.product_fit.reasons.map((reason, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <span className="text-emerald-400">✓</span>
                                                <span className="text-sm text-slate-300">{reason}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                        <p className="text-xs text-amber-400 font-medium mb-1">💡 Suggested Approach</p>
                                        <p className="text-sm text-slate-300">{result.product_fit.suggested_angle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Market Signals */}
                        <div className="battle-card">
                            <div className="battle-card-header">
                                <div className="battle-card-icon bg-cyan-500/10">
                                    <Radio className="w-5 h-5 text-cyan-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-100">Market Signals</h3>
                            </div>
                            <div className="space-y-3">
                                {result.news.map((item, i) => (
                                    <div key={i} className="p-3 rounded-lg bg-slate-800/50">
                                        <p className="text-slate-200 text-sm mb-2">{item.headline}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`badge ${getSentimentBadge(item.sentiment)}`}>{item.sentiment}</span>
                                            {item.source && <span className="text-xs text-slate-500">{item.source}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Financial Pulse */}
                        <div className="battle-card">
                            <div className="battle-card-header">
                                <div className="battle-card-icon bg-emerald-500/10">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-100">Financial Pulse</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-slate-800/50">
                                    <p className="text-xs text-slate-500 uppercase mb-1">Stock Price</p>
                                    <p className="text-2xl font-bold mono text-slate-100">{result.financial_health.stock_price}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-slate-800/50">
                                    <p className="text-xs text-slate-500 uppercase mb-1">Market Cap</p>
                                    <p className="text-2xl font-bold mono text-slate-100">{result.financial_health.market_cap}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-slate-800/50">
                                    <p className="text-xs text-slate-500 uppercase mb-1">52W Change</p>
                                    <p className={`text-2xl font-bold mono ${result.financial_health.change_52w.startsWith('+') ? 'text-emerald-400' :
                                        result.financial_health.change_52w.startsWith('-') ? 'text-red-400' : 'text-slate-100'
                                        }`}>{result.financial_health.change_52w}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-slate-800/50">
                                    <p className="text-xs text-slate-500 uppercase mb-1">Health Score</p>
                                    <p className={`text-2xl font-bold ${getHealthColor(result.financial_health.health_score)}`}>
                                        {result.financial_health.health_score}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tactical Strategy */}
                        <div className="battle-card">
                            <div className="battle-card-header">
                                <div className="battle-card-icon bg-amber-500/10">
                                    <Target className="w-5 h-5 text-amber-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-100">Tactical Strategy</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="p-3 rounded-lg bg-slate-800/50 border-l-4 border-amber-500">
                                    <p className="text-sm text-slate-300 italic">{result.strategy.reasoning}</p>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-xs text-slate-500 uppercase">3-Point Pitch Strategy</p>
                                    {result.strategy.pitch_points.map((point, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold flex items-center justify-center">
                                                {i + 1}
                                            </span>
                                            <p className="text-slate-200 text-sm">{point}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Cold Email */}
                        <div className="battle-card">
                            <div className="battle-card-header">
                                <div className="battle-card-icon bg-purple-500/10">
                                    <Mail className="w-5 h-5 text-purple-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-100">Cold Outreach</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                                    <p className="text-slate-200 leading-relaxed italic">&ldquo;{result.cold_email}&rdquo;</p>
                                </div>
                                <button
                                    onClick={handleCopyEmail}
                                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${copied
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600'
                                        }`}
                                >
                                    {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Email</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
