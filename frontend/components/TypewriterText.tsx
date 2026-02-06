'use client';

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
    text: string;
    speed?: number;
    className?: string;
    onComplete?: () => void;
}

export default function TypewriterText({
    text,
    speed = 20,
    className = '',
    onComplete
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        // Reset state for new text
        setDisplayedText('');
        setIsTyping(true);
        let currentIndex = 0;

        const timer = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(text.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(timer);
                setIsTyping(false);
                onComplete?.();
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed, onComplete]);

    return (
        <span className={className}>
            {displayedText}
            {isTyping && (
                <span className="inline-block w-0.5 h-5 bg-cyan-400 ml-1 animate-pulse" />
            )}
        </span>
    );
}
