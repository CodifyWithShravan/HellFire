'use client';

import { useState } from 'react';
import {
    Megaphone,
    Sparkles,
    Target,
    FileText,
    Video,
    Image,
    BookOpen,
    MessageSquare,
    Copy,
    Check,
    AlertCircle,
    Loader2
} from 'lucide-react';

interface ContentIdea {
    title: string;
    description: string;
    content_type: string;
}

interface AdCopy {
    headline: string;
    body: string;
    variation_focus: string;
}

interface CampaignResult {
    product_name: string;
    platform: string;
    campaign_objectives: string[];
    content_ideas: ContentIdea[];
    ad_copies: AdCopy[];
    cta_suggestions: string[];
}

const PLATFORMS = ['LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'YouTube'];

const getContentIcon = (type: string) => {
    switch (type.toLowerCase()) {
        case 'video': return <Video className="w-4 h-4" />;
        case 'carousel': return <Image className="w-4 h-4" />;
        case 'article': return <BookOpen className="w-4 h-4" />;
        case 'story': return <Sparkles className="w-4 h-4" />;
        default: return <FileText className="w-4 h-4" />;
    }
};

const getVariationColor = (focus: string) => {
    switch (focus.toLowerCase()) {
        case 'pain_point': return 'badge-negative';
        case 'benefit': return 'badge-positive';
        case 'urgency': return 'badge-amber';
        default: return 'badge-neutral';
    }
};

export default function CampaignGenerator() {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [platform, setPlatform] = useState('LinkedIn');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CampaignResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productName.trim() || !productDescription.trim() || !targetAudience.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_name: productName.trim(),
                    product_description: productDescription.trim(),
                    target_audience: targetAudience.trim(),
                    platform
                }),
            });

            if (!response.ok) throw new Error('Failed to generate campaign');
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError('Unable to generate campaign. Please ensure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyAd = (index: number, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="space-y-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Product Name *</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="e.g., CloudSync Pro"
                            className="war-room-input w-full"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Platform *</label>
                        <div className="flex gap-2 flex-wrap">
                            {PLATFORMS.map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPlatform(p)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${platform === p
                                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                                        : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-600'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Product Description *</label>
                    <textarea
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        placeholder="Describe your product or service in detail..."
                        className="war-room-input w-full h-24 resize-none"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Target Audience *</label>
                    <input
                        type="text"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="e.g., Small business owners aged 30-50 in the tech industry"
                        className="war-room-input w-full"
                        required
                    />
                </div>

                {/* Try Example Button */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => {
                            setProductName('Tesla Model Y');
                            setProductDescription('All-electric compact SUV with autopilot, 330-mile range, and the safest SUV rating. Features include over-the-air updates, premium audio, and zero emissions.');
                            setTargetAudience('Tech-savvy professionals aged 30-50 interested in sustainability, innovation, and premium vehicles');
                            setPlatform('LinkedIn');
                        }}
                        className="text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
                    >
                        ✨ Try Example (Tesla Campaign)
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading || !productName.trim() || !productDescription.trim() || !targetAudience.trim()}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating Campaign...
                        </>
                    ) : (
                        <>
                            <Megaphone className="w-5 h-5" />
                            Generate Marketing Campaign
                        </>
                    )}
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
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-100 mb-2">
                            {result.product_name} - {result.platform} Campaign
                        </h2>
                    </div>

                    {/* Campaign Objectives */}
                    <div className="battle-card">
                        <div className="battle-card-header">
                            <div className="battle-card-icon bg-cyan-500/10">
                                <Target className="w-5 h-5 text-cyan-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100">Campaign Objectives</h3>
                        </div>
                        <div className="space-y-3">
                            {result.campaign_objectives.map((obj, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold flex items-center justify-center">
                                        {i + 1}
                                    </span>
                                    <p className="text-slate-200">{obj}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Ideas */}
                    <div className="battle-card">
                        <div className="battle-card-header">
                            <div className="battle-card-icon bg-purple-500/10">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100">Content Ideas</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {result.content_ideas.map((idea, i) => (
                                <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-purple-500/30 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="p-1.5 rounded bg-purple-500/20 text-purple-400">
                                            {getContentIcon(idea.content_type)}
                                        </span>
                                        <span className="text-xs text-purple-400 uppercase font-medium">{idea.content_type}</span>
                                    </div>
                                    <h4 className="font-semibold text-slate-100 mb-1">{idea.title}</h4>
                                    <p className="text-sm text-slate-400">{idea.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ad Copies */}
                    <div className="battle-card">
                        <div className="battle-card-header">
                            <div className="battle-card-icon bg-amber-500/10">
                                <MessageSquare className="w-5 h-5 text-amber-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100">Ad Copy Variations</h3>
                        </div>
                        <div className="space-y-4">
                            {result.ad_copies.map((copy, i) => (
                                <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`badge ${getVariationColor(copy.variation_focus)}`}>
                                            {copy.variation_focus.replace('_', ' ')}
                                        </span>
                                        <button
                                            onClick={() => handleCopyAd(i, `${copy.headline}\n\n${copy.body}`)}
                                            className="flex items-center gap-1 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                                        >
                                            {copiedIndex === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            {copiedIndex === i ? 'Copied!' : 'Copy'}
                                        </button>
                                    </div>
                                    <h4 className="font-bold text-lg text-slate-100 mb-2">{copy.headline}</h4>
                                    <p className="text-slate-300">{copy.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Suggestions */}
                    <div className="battle-card">
                        <div className="battle-card-header">
                            <div className="battle-card-icon bg-emerald-500/10">
                                <Target className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100">Call-to-Action Suggestions</h3>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {result.cta_suggestions.map((cta, i) => (
                                <span key={i} className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                                    {cta}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
