'use client';

import { useState, useEffect } from 'react';
import {
  Megaphone,
  Mic,
  BarChart3,
  Building2,
  Zap,
  ArrowLeft
} from 'lucide-react';
import HeroLanding from '@/components/HeroLanding';
import CampaignGenerator from '@/components/CampaignGenerator';
import PitchCreator from '@/components/PitchCreator';
import LeadScorer from '@/components/LeadScorer';
import CompanyIntel from '@/components/CompanyIntel';

type TabType = 'campaign' | 'pitch' | 'score' | 'intel';

const tabs = [
  { id: 'campaign' as TabType, label: 'Campaign Generator', icon: Megaphone, color: 'cyan' },
  { id: 'pitch' as TabType, label: 'Pitch Creator', icon: Mic, color: 'purple' },
  { id: 'score' as TabType, label: 'Lead Scorer', icon: BarChart3, color: 'emerald' },
  { id: 'intel' as TabType, label: 'Company Intel', icon: Building2, color: 'amber' },
];

export default function MarketAISuite() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('campaign');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Check if user has visited before (optional: skip landing on return)
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('marketmind_visited');
    if (hasVisited) {
      const timer = setTimeout(() => setShowLanding(false), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleGetStarted = () => {
    // Trigger hyperspace warp effect
    if (typeof window !== 'undefined' && (window as any).triggerParticleWarp) {
      (window as any).triggerParticleWarp();
    }
    
    setIsTransitioning(true);
    sessionStorage.setItem('marketmind_visited', 'true');

    // Wait for warp effect, then transition
    setTimeout(() => {
      setShowLanding(false);
    }, 1500);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 2000);
  };

  const handleBackToLanding = () => {
    sessionStorage.removeItem('marketmind_visited');
    setIsTransitioning(true);
    setTimeout(() => {
      setShowLanding(true);
      setIsTransitioning(false);
    }, 300);
  };

  // Show Landing Page  
  if (showLanding) {
    return (
      <>
        {/* White flash overlay during warp */}
        <div 
          className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-700 ${
            isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            background: 'radial-gradient(circle at center, rgba(6,182,212,0.4) 0%, rgba(139,92,246,0.2) 40%, transparent 70%)',
          }}
        />
        
        <div 
          className={`transition-all duration-1000 ease-out ${
            isTransitioning 
              ? 'opacity-0 scale-[1.5]' 
              : 'opacity-100 scale-100'
          }`}
          style={{ transformOrigin: 'center center' }}
        >
          <HeroLanding onGetStarted={handleGetStarted} />
        </div>
      </>
    );
  }

  // Main Dashboard
  return (
    <main 
      className={`min-h-screen p-4 md:p-8 relative transition-all duration-700 ease-out ${
        isTransitioning 
          ? 'opacity-0 scale-95' 
          : 'opacity-100 scale-100'
      }`}
      style={{ transformOrigin: 'center top' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10 pt-4">
          {/* Back Button */}
          <button
            onClick={handleBackToLanding}
            className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Home</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">Powered by Groq LLaMA 3.3 70B</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="text-gradient-cyan">Market</span>
              <span className="text-slate-100">AI</span>
              <span className="text-slate-500 text-2xl ml-3">Suite</span>
            </h1>

            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              AI-powered sales & marketing platform. Generate campaigns, craft pitches, qualify leads, and research companies.
            </p>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm md:text-base font-medium border transition-all duration-300 ${isActive
                  ? tab.color === 'cyan'
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                    : tab.color === 'purple'
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-lg shadow-purple-500/10'
                      : tab.color === 'emerald'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-300'
                  }`}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'campaign' && <CampaignGenerator />}
          {activeTab === 'pitch' && <PitchCreator />}
          {activeTab === 'score' && <LeadScorer />}
          {activeTab === 'intel' && <CompanyIntel />}
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pb-8 text-slate-500 text-sm">
          <p>MarketAI Suite • Powered by Groq AI • Real-time Market Intelligence</p>
        </footer>
      </div>
    </main>
  );
}