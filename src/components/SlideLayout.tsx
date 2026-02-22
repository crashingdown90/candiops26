'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClassifiedBadge from './ClassifiedBadge';
import Navigation from './Navigation';
import ProgressBar from './ProgressBar';
import AuthGuard from './AuthGuard';
import { useAuth } from './AuthContext';

interface SlideLayoutProps {
    children: React.ReactNode;
    currentSlide: number;
    totalSlides: number;
    classification?: string;
    slideType?: string;
}

export default function SlideLayout({
    children,
    currentSlide,
    totalSlides,
    classification = 'SANGAT RAHASIA',
    slideType = 'content',
}: SlideLayoutProps) {
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                if (currentSlide < totalSlides - 1) {
                    router.push(`/slide/${currentSlide + 1}`);
                }
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (currentSlide > 0) {
                    router.push(`/slide/${currentSlide - 1}`);
                }
            } else if (e.key === 'Home') {
                e.preventDefault();
                router.push('/slide/0');
            } else if (e.key === 'End') {
                e.preventDefault();
                router.push(`/slide/${totalSlides - 1}`);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide, totalSlides, router]);

    return (
        <AuthGuard>
            <div className={`slide-wrapper slide-type-${slideType}`}>
                {/* Scanline overlay */}
                <div className="scanline-overlay" />

                {/* Header */}
                <header className="slide-header">
                    <div className="header-left">
                        <span className="header-code">CANDI OPS 26</span>
                    </div>
                    <ClassifiedBadge level={classification} size="sm" />
                    <div className="header-right">
                        <span className="header-timestamp">{new Date().toISOString().split('T')[0]}</span>
                        <button onClick={handleLogout} className="logout-button" title="Logout">
                            ⏻ LOGOUT
                        </button>
                    </div>
                </header>

                {/* Main content */}
                <main className="slide-main">
                    {children}
                </main>

                {/* Footer */}
                <footer className="slide-footer">
                    <ProgressBar current={currentSlide} total={totalSlides} />
                    <Navigation currentSlide={currentSlide} totalSlides={totalSlides} />
                </footer>
            </div>
        </AuthGuard>
    );
}
