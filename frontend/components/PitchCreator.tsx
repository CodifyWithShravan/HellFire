'use client';

import { useState } from 'react';
import {
    Mic,
    Sparkles,
    Target,
    Award,
    ArrowRight,
    Copy,
    Check,
    AlertCircle,
    Loader2,
    Building2,
    User
} from 'lucide-react';

interface PitchResult {
    product_name: string;
    prospect_info: string;
    elevator_pitch: string;
    value_proposition: string;
    differentiators: string[];
    strategic_cta: string;
}

const COMPANY_SIZES = ['Startup (1-50)', 'SMB (51-200)', 'Mid-Market (201-500)', 'Enterprise (500+)'];

export default function PitchCreator() {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [prospectRole, setProspectRole] = useState('');
    const [prospectCompany, setProspectCompany] = useState('');
    const [companySize, setCompanySize] = useState('Enterprise (500+)');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PitchResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copiedSection, setCopiedSection] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productName.trim() || !productDescription.trim() || !prospectRole.trim() || !prospectCompany.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('http://localhost:8000/pitch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_name: productName.trim(),
                    product_description: productDescription.trim(),
                    prospect_role: prospectRole.trim(),
                    prospect_company: prospectCompany.trim(),
                    company_size: companySize
                }),
            });

            if (!response.ok) throw new Error('Failed to generate pitch');
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError('Unable to generate pitch. Please ensure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (section: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
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
                        <label className="text-sm font-medium text-slate-300">Company Size *</label>
                        <select
                            value={companySize}
                            onChange={(e) => setCompanySize(e.target.value)}
                            className="war-room-input w-full"
                        >
                            {COMPANY_SIZES.map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Product Description *</label>
                    <textarea
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        placeholder="Describe your product or service, key features, and benefits..."
                        className="war-room-input w-full h-24 resize-none"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <User className="w-4 h-4" /> Prospect Role *
                        </label>
                        <input
                            type="text"
                            value={prospectRole}
                            onChange={(e) => setProspectRole(e.target.value)}
                            placeholder="e.g., IT Director, VP of Sales, CTO"
                            className="war-room-input w-full"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> Prospect Company *
                        </label>
                        <input
                            type="text"
                            value={prospectCompany}
                            onChange={(e) => setProspectCompany(e.target.value)}
                            placeholder="e.g., Acme Corporation"
                            className="war-room-input w-full"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !productName.trim() || !productDescription.trim() || !prospectRole.trim() || !prospectCompany.trim()}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Crafting Pitch...
                        </>
                    ) : (
                        <>
                            <Mic className="w-5 h-5" />
                            Generate Sales Pitch
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
                            Pitch for {result.prospect_info}
                        </h2>
                    </div>

                    {/* Elevator Pitch */}
                    <div className="battle-card">
                        <div className="battle-card-header">
                            <div className="battle-card-icon bg-cyan-500/10">
                                <Mic className="w-5 h-5 text-cyan-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100">30-Second Elevator Pitch</h3>
                            <button
                                onClick={() => handleCopy('elevator', result.elevator_pitch)}
                                className="ml-auto flex items-center gap-1 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                            >
                                {copiedSection === 'elevator' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copiedSection === 'elevator' ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                            <p className="text-lg text-slate-200 leading-relaxed italic">&ldquo;{result.elevator_pitch}&rdquo;</p>
                        </div>
                    </div>

                    {/* Value Proposition */}
                    <div className="battle-card">
                        <div className="battle-card-header">
                            <div className="battle-card-icon bg-purple-500/10">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100">Value Proposition</h3>
                            <button
                                onClick={() => handleCopy('value', result.value_proposition)}
                                className="ml-auto flex items-center gap-1 text-sm text-slate-400 hover:text-purple-400 transition-colors"
                            >
                                {copiedSection === 'value' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copiedSection === 'value' ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <p className="text-slate-200 text-lg leading-relaxed">{result.value_proposition}</p>
                    </div>

                    {/* Differentiators */}
                    <div className="battle-card">
                        <div className="battle-card-header">
                            <div className="battle-card-icon bg-amber-500/10">
                                <Award className="w-5 h-5 text-amber-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100">Key Differentiators</h3>
                        </div>
                        <div className="space-y-3">
                            {result.differentiators.map((diff, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50 border-l-4 border-amber-500">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center">
                                        {i + 1}
                                    </span>
                                    <p className="text-slate-200 leading-relaxed">{diff}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Strategic CTA */}
                    <div className="battle-card">
                        <div className="battle-card-header">
                            <div className="battle-card-icon bg-emerald-500/10">
                                <Target className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100">Strategic Call-to-Action</h3>
                            <button
                                onClick={() => handleCopy('cta', result.strategic_cta)}
                                className="ml-auto flex items-center gap-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                            >
                                {copiedSection === 'cta' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copiedSection === 'cta' ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                            <div className="flex items-center gap-3">
                                <ArrowRight className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                                <p className="text-emerald-300 text-lg font-medium">{result.strategic_cta}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
