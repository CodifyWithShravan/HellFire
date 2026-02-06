'use client';

import { useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    AlertCircle,
    Loader2,
    User,
    Building2,
    DollarSign,
    Clock,
    Zap,
    Shield,
    Target,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';

interface ScoreBreakdown {
    budget: number;
    authority: number;
    need: number;
    timeline: number;
    fit: number;
}

interface LeadResult {
    lead_name: string;
    company: string;
    score: number;
    score_breakdown: ScoreBreakdown;
    reasoning: string;
    conversion_probability: string;
    recommended_action: string;
}

const TIMELINES = ['Immediate (< 1 month)', '1-3 months', '3-6 months', '6-12 months', '12+ months'];
const URGENCY_LEVELS = ['Critical - Must solve now', 'High - Priority this quarter', 'Medium - On the roadmap', 'Low - Exploring options'];
const AUTHORITY_LEVELS = ['Final decision maker', 'Key influencer', 'Part of buying committee', 'Researcher/Evaluator'];
const FIT_LEVELS = ['Perfect fit - exact use case', 'Strong alignment', 'Moderate fit', 'Partial fit', 'Exploring fit'];

const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-cyan-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
};

const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-emerald-400';
    if (score >= 60) return 'from-cyan-500 to-cyan-400';
    if (score >= 40) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
};

const getProbabilityBadge = (prob: string) => {
    switch (prob.toLowerCase()) {
        case 'very high': return 'badge-positive';
        case 'high': return 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30';
        case 'medium': return 'badge-amber';
        default: return 'badge-negative';
    }
};

export default function LeadScorer() {
    const [leadName, setLeadName] = useState('');
    const [company, setCompany] = useState('');
    const [budget, setBudget] = useState('');
    const [timeline, setTimeline] = useState('1-3 months');
    const [urgency, setUrgency] = useState('High - Priority this quarter');
    const [authority, setAuthority] = useState('Key influencer');
    const [needFit, setNeedFit] = useState('Strong alignment');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<LeadResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadName.trim() || !company.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lead_name: leadName.trim(),
                    company: company.trim(),
                    budget: budget.trim() || 'Not specified',
                    timeline,
                    urgency,
                    decision_authority: authority,
                    need_fit: needFit
                }),
            });

            if (!response.ok) throw new Error('Failed to score lead');
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError('Unable to score lead. Please ensure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <User className="w-4 h-4" /> Lead Name *
                        </label>
                        <input
                            type="text"
                            value={leadName}
                            onChange={(e) => setLeadName(e.target.value)}
                            placeholder="e.g., John Smith"
                            className="war-room-input w-full"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> Company *
                        </label>
                        <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="e.g., TechStart Inc"
                            className="war-room-input w-full"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> Budget
                        </label>
                        <input
                            type="text"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="e.g., $50,000"
                            className="war-room-input w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Timeline
                        </label>
                        <select
                            value={timeline}
                            onChange={(e) => setTimeline(e.target.value)}
                            className="war-room-input w-full"
                        >
                            {TIMELINES.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Urgency Level
                        </label>
                        <select
                            value={urgency}
                            onChange={(e) => setUrgency(e.target.value)}
                            className="war-room-input w-full"
                        >
                            {URGENCY_LEVELS.map((u) => (
                                <option key={u} value={u}>{u}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Shield className="w-4 h-4" /> Decision Authority
                        </label>
                        <select
                            value={authority}
                            onChange={(e) => setAuthority(e.target.value)}
                            className="war-room-input w-full"
                        >
                            {AUTHORITY_LEVELS.map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Target className="w-4 h-4" /> Need/Fit Assessment
                    </label>
                    <select
                        value={needFit}
                        onChange={(e) => setNeedFit(e.target.value)}
                        className="war-room-input w-full"
                    >
                        {FIT_LEVELS.map((f) => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                </div>

                {/* Try Example Button */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => {
                            setLeadName('Sarah Johnson');
                            setCompany('Stripe');
                            setBudget('$75,000');
                            setTimeline('1-3 months');
                            setUrgency('Critical - Must solve now');
                            setAuthority('Final decision maker');
                            setNeedFit('Perfect fit - exact use case');
                        }}
                        className="text-sm text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
                    >
                        ✨ Try Example (High-Potential Lead)
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading || !leadName.trim() || !company.trim()}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing Lead...
                        </>
                    ) : (
                        <>
                            <BarChart3 className="w-5 h-5" />
                            Score & Qualify Lead
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
                    {/* Score Header */}
                    <div className="battle-card">
                        <div className="flex flex-col md:flex-row items-center gap-8 p-4">
                            {/* Score Circle */}
                            <div className="relative">
                                <svg className="w-40 h-40 transform -rotate-90">
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        className="text-slate-700"
                                    />
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="url(#scoreGradient)"
                                        strokeWidth="12"
                                        fill="transparent"
                                        strokeDasharray={`${(result.score / 100) * 440} 440`}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000"
                                    />
                                    <defs>
                                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" className={`${result.score >= 60 ? 'stop-color-cyan' : 'stop-color-amber'}`} stopColor={result.score >= 80 ? '#10b981' : result.score >= 60 ? '#06b6d4' : result.score >= 40 ? '#f59e0b' : '#ef4444'} />
                                            <stop offset="100%" className={`${result.score >= 60 ? 'stop-color-emerald' : 'stop-color-red'}`} stopColor={result.score >= 80 ? '#34d399' : result.score >= 60 ? '#22d3ee' : result.score >= 40 ? '#fbbf24' : '#f87171'} />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-5xl font-bold ${getScoreColor(result.score)}`}>{result.score}</span>
                                    <span className="text-slate-500 text-sm">/ 100</span>
                                </div>
                            </div>

                            {/* Lead Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl font-bold text-slate-100 mb-2">{result.lead_name}</h2>
                                <p className="text-slate-400 mb-4">{result.company}</p>
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    <span className={`badge ${getProbabilityBadge(result.conversion_probability)}`}>
                                        <TrendingUp className="w-3 h-3" />
                                        {result.conversion_probability} Conversion
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="battle-card">
                        <div className="battle-card-header">
                            <div className="battle-card-icon bg-purple-500/10">
                                <BarChart3 className="w-5 h-5 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100">BANT+F Score Breakdown</h3>
                        </div>
                        <div className="space-y-4">
                            {Object.entries(result.score_breakdown).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-300 capitalize font-medium">{key}</span>
                                        <span className="text-slate-400">{value}/20</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${getScoreGradient(value * 5)} transition-all duration-500`}
                                            style={{ width: `${(value / 20) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reasoning */}
                    <div className="battle-card">
                        <div className="battle-card-header">
                            <div className="battle-card-icon bg-cyan-500/10">
                                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100">Analysis & Reasoning</h3>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{result.reasoning}</p>
                    </div>

                    {/* Recommended Action */}
                    <div className="battle-card">
                        <div className="battle-card-header">
                            <div className="battle-card-icon bg-emerald-500/10">
                                <ArrowRight className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100">Recommended Action</h3>
                        </div>
                        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                            <p className="text-emerald-300 font-medium">{result.recommended_action}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
