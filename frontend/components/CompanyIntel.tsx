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

interface CompanyIntelResult {
    company_name: string;
    financial_health: FinancialHealth;
    news: NewsItem[];
    strategy: Strategy;
    cold_email: string;
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
            const response = await fetch('http://localhost:8000/intel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company_name: companyName.trim() }),
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
            <form onSubmit={handleSubmit} className="glass-card p-4 flex flex-col sm:flex-row gap-3">
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
