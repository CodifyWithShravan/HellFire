'use client';

import { useEffect, useState } from 'react';

const SCAN_STEPS = [
    { id: 1, label: 'Scanning Market Signals...', icon: '📡' },
    { id: 2, label: 'Analyzing Financial Data...', icon: '📊' },
    { id: 3, label: 'Processing News Intelligence...', icon: '📰' },
    { id: 4, label: 'Synthesizing Battle Strategy...', icon: '🎯' },
    { id: 5, label: 'Generating Cold Outreach...', icon: '✉️' },
];

interface ScanProgressProps {
    isActive: boolean;
}

export default function ScanProgress({ isActive }: ScanProgressProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isActive) {
            // Reset when becoming inactive
            const resetTimer = setTimeout(() => {
                setCurrentStep(0);
                setProgress(0);
            }, 0);
            return () => clearTimeout(resetTimer);
        }

        // Progress bar animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 100;
                return prev + 2;
            });
        }, 100);

        // Step progression
        const stepInterval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev >= SCAN_STEPS.length - 1) return prev;
                return prev + 1;
            });
        }, 1200);

        return () => {
            clearInterval(progressInterval);
            clearInterval(stepInterval);
        };
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div className="glass-card p-8 max-w-xl mx-auto animate-slide-up">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping absolute" />
                    <div className="w-3 h-3 bg-cyan-400 rounded-full relative" />
                </div>
                <span className="text-cyan-400 font-semibold tracking-wide uppercase text-sm">
                    Intelligence Scan Active
                </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500 mono">
                    <span>Analyzing...</span>
                    <span>{Math.min(progress, 100)}%</span>
                </div>
            </div>

            {/* Steps */}
            <div className="space-y-1">
                {SCAN_STEPS.map((step, index) => (
                    <div
                        key={step.id}
                        className={`scan-step ${index === currentStep ? 'active' :
                                index < currentStep ? 'complete' : ''
                            }`}
                    >
                        <div className="scan-step-dot" />
                        <span className="text-sm">
                            {step.icon} {step.label}
                        </span>
                        {index === currentStep && (
                            <span className="ml-auto text-cyan-400 text-xs mono">
                                Processing...
                            </span>
                        )}
                        {index < currentStep && (
                            <span className="ml-auto text-emerald-400 text-xs">
                                ✓
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
