'use client';

import React from 'react';

interface ClassifiedBadgeProps {
    level?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function ClassifiedBadge({ level = 'SANGAT RAHASIA', size = 'md' }: ClassifiedBadgeProps) {
    const sizeClasses = {
        sm: 'classified-badge-sm',
        md: 'classified-badge-md',
        lg: 'classified-badge-lg',
    };

    return (
        <div className={`classified-badge ${sizeClasses[size]}`}>
            <span className="classified-badge-icon">◆</span>
            <span className="classified-badge-text">{level}</span>
            <span className="classified-badge-icon">◆</span>
        </div>
    );
}
