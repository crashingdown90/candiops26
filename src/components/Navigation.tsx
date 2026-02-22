'use client';

import React from 'react';
import Link from 'next/link';

interface NavigationProps {
    currentSlide: number;
    totalSlides: number;
}

export default function Navigation({ currentSlide, totalSlides }: NavigationProps) {
    const hasPrev = currentSlide > 0;
    const hasNext = currentSlide < totalSlides - 1;

    return (
        <div className="navigation">
            {hasPrev ? (
                <Link href={`/slide/${currentSlide - 1}`} className="nav-button nav-prev">
                    <span className="nav-arrow">◄</span>
                    <span className="nav-label">PREV</span>
                </Link>
            ) : (
                <div className="nav-button nav-disabled">
                    <span className="nav-arrow">◄</span>
                    <span className="nav-label">PREV</span>
                </div>
            )}

            <div className="nav-indicator">
                <span className="nav-code">SLIDE {String(currentSlide + 1).padStart(2, '0')}</span>
            </div>

            {hasNext ? (
                <Link href={`/slide/${currentSlide + 1}`} className="nav-button nav-next">
                    <span className="nav-label">NEXT</span>
                    <span className="nav-arrow">►</span>
                </Link>
            ) : (
                <div className="nav-button nav-disabled">
                    <span className="nav-label">NEXT</span>
                    <span className="nav-arrow">►</span>
                </div>
            )}
        </div>
    );
}
