'use client';

import React from 'react';

interface ProgressBarProps {
    current: number;
    total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
    const percentage = ((current + 1) / total) * 100;

    return (
        <div className="progress-container">
            <div className="progress-info">
                <span className="progress-label">PROGRESS BRIEFING</span>
                <span className="progress-count">{current + 1} / {total}</span>
            </div>
            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                />
                {Array.from({ length: total }, (_, i) => (
                    <div
                        key={i}
                        className={`progress-dot ${i <= current ? 'progress-dot-active' : ''}`}
                        style={{ left: `${((i + 0.5) / total) * 100}%` }}
                    />
                ))}
            </div>
        </div>
    );
}
