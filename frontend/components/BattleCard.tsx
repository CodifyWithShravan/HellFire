'use client';

import { ReactNode } from 'react';

interface BattleCardProps {
    title: string;
    icon: ReactNode;
    iconBg: string;
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function BattleCard({
    title,
    icon,
    iconBg,
    children,
    className = '',
    delay = 0
}: BattleCardProps) {
    return (
        <div
            className={`battle-card animate-slide-up ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="battle-card-header">
                <div className={`battle-card-icon ${iconBg}`}>
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-slate-100">{title}</h3>
            </div>
            <div className="battle-card-content">
                {children}
            </div>
        </div>
    );
}
