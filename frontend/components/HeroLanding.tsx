'use client';

import { useState, useEffect } from 'react';
import {
    Zap,
    Target,
    TrendingUp,
    Radio,
    Sparkles,
    ArrowRight,
    Shield,
    Globe,
    BarChart3,
    Cpu,
    Layers,
    Rocket
} from 'lucide-react';

interface HeroLandingProps {
    onGetStarted: () => void;
}

const features = [
    {
        icon: Target,
        title: 'AI Battle Cards',
        description: 'Generate tactical sales strategies in seconds',
        color: 'cyan'
    },
    {
        icon: Radio,
        title: 'Live Market Signals',
        description: 'Real-time news and sentiment analysis',
        color: 'emerald'
    },
    {
        icon: TrendingUp,
        title: 'Financial Intelligence',
        description: 'Stock data and market cap insights',
        color: 'purple'
    },
    {
        icon: Sparkles,
        title: 'Smart Outreach',
        description: 'Hyper-personalized cold emails',
        color: 'amber'
    }
];

const stats = [
    { value: '10x', label: 'Faster Research', icon: Rocket },
    { value: '85%', label: 'Time Saved', icon: Layers },
    { value: '3x', label: 'More Conversions', icon: Cpu }
];

export default function HeroLanding({ onGetStarted }: HeroLandingProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [typedText, setTypedText] = useState('');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const fullText = 'Sales Intelligence War Room';

    useEffect(() => {
        setIsVisible(true);

        // Typewriter effect
        let index = 0;
        const timer = setInterval(() => {
            if (index <= fullText.length) {
                setTypedText(fullText.slice(0, index));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 50);

        return () => clearInterval(timer);
    }, []);

    // Mouse move effect for interactive glow
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className={`min-h-screen flex flex-col transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Floating Orbs Background */}
            <div className="floating-orbs">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

            {/* Interactive cursor glow */}
            <div
                className="fixed w-96 h-96 pointer-events-none z-0 transition-all duration-300 ease-out"
                style={{
                    left: mousePosition.x - 192,
                    top: mousePosition.y - 192,
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
                    filter: 'blur(40px)'
                }}
            />

            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-cyan-500/10 border border-cyan-500/20 animate-slide-down stagger-1 hover:border-cyan-500/40 transition-colors cursor-default">
                    <div className="relative">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <div className="absolute inset-0 animate-ping">
                            <Zap className="w-4 h-4 text-cyan-400 opacity-50" />
                        </div>
                    </div>
                    <span className="text-cyan-400 text-sm font-medium">Powered by Groq LLaMA 3.3 70B</span>
                </div>

                {/* Main Heading */}
                <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-extrabold text-center mb-6 animate-slide-up stagger-2">
                    <span className="text-gradient-animated">Market</span>
                    <span className="text-white">Mind</span>
                    <span className="text-slate-600 text-4xl md:text-5xl lg:text-6xl ml-4 animate-text-glow">AI</span>
                </h1>

                {/* Tagline with Typewriter */}
                <div className="h-10 mb-4 animate-slide-up stagger-3">
                    <p className="text-xl md:text-2xl lg:text-3xl text-slate-400 text-center">
                        {typedText}
                        <span className="inline-block w-0.5 h-7 bg-cyan-400 ml-1 animate-pulse" />
                    </p>
                </div>

                {/* Subheading */}
                <p className="hero-subtitle text-slate-500 text-center max-w-xl mb-12 text-base md:text-lg animate-fade-in stagger-4">
                    Generate AI-powered Battle Cards, analyze market signals, and craft
                    hyper-personalized outreach in seconds.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 animate-scale-in stagger-5">
                    <button
                        onClick={onGetStarted}
                        className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500 hover:from-cyan-400 hover:via-cyan-300 hover:to-cyan-400 text-slate-900 font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30 animate-gradient"
                    >
                        <span className="flex items-center gap-3">
                            Get Started
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                        </span>

                        {/* Shine effect */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </div>
                    </button>

                    <button className="btn-ghost flex items-center gap-2 group">
                        <span>Watch Demo</span>
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                            <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-cyan-400 border-b-4 border-b-transparent ml-0.5" />
                        </div>
                    </button>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-20 animate-slide-up stagger-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="text-center group cursor-default"
                            >
                                <div className="flex items-center justify-center mb-2">
                                    <Icon className="w-5 h-5 text-slate-600 mr-2 group-hover:text-cyan-400 transition-colors" />
                                    <p className="text-4xl md:text-5xl font-bold text-gradient-cyan group-hover:animate-text-glow">{stat.value}</p>
                                </div>
                                <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Features Section */}
            <section className="px-4 py-20 border-t border-slate-800/50 relative">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl md:text-4xl font-bold text-center text-white mb-4 animate-slide-up">
                        Your Tactical <span className="text-gradient-cyan">Command Center</span>
                    </h2>
                    <p className="text-slate-500 text-center mb-16 max-w-2xl mx-auto animate-fade-in">
                        Everything you need to dominate your sales pipeline in one powerful platform
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            const colorMap: Record<string, { bg: string; text: string; border: string; shadow: string }> = {
                                cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'hover:border-cyan-500/30', shadow: 'group-hover:shadow-cyan-500/10' },
                                emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'hover:border-emerald-500/30', shadow: 'group-hover:shadow-emerald-500/10' },
                                purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'hover:border-purple-500/30', shadow: 'group-hover:shadow-purple-500/10' },
                                amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'hover:border-amber-500/30', shadow: 'group-hover:shadow-amber-500/10' }
                            };
                            const colorClasses = colorMap[feature.color] || colorMap.cyan;

                            return (
                                <div
                                    key={index}
                                    className={`feature-card glass-card p-6 group cursor-pointer ${colorClasses.border} ${colorClasses.shadow} animate-slide-up`}
                                    style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                                >
                                    <div className={`w-14 h-14 rounded-2xl mb-5 flex items-center justify-center ${colorClasses.bg} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`w-7 h-7 ${colorClasses.text}`} />
                                    </div>
                                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-cyan-400 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Hover arrow */}
                                    <div className="mt-4 flex items-center gap-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-sm font-medium">Learn more</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="px-4 py-10 border-t border-slate-800/50">
                <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 md:gap-16">
                    {[
                        { icon: Shield, text: 'Enterprise Security' },
                        { icon: Globe, text: 'Real-time Data' },
                        { icon: BarChart3, text: 'Market Intelligence' },
                        { icon: Zap, text: 'AI-Powered' }
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors cursor-default group"
                        >
                            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-sm">{item.text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-8 text-slate-600 text-sm border-t border-slate-800/50">
                <p className="hover:text-slate-400 transition-colors cursor-default mb-3">
                    MarketMind AI • Built for the Modern Sales Team
                </p>
                <a
                    href="https://github.com/yourusername/MarketMind"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    <span>View on GitHub</span>
                </a>
            </footer>
        </div>
    );
}
