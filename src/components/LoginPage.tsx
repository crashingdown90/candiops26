'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [typedText, setTypedText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const { login, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const fullText = 'SISTEM KEAMANAN AKTIF — MASUKKAN KODE AKSES';

    // Redirect if already authenticated
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace('/slide/0');
        }
    }, [isAuthenticated, isLoading, router]);

    // Typing animation
    useEffect(() => {
        setShowContent(true);
        let i = 0;
        const interval = setInterval(() => {
            if (i < fullText.length) {
                setTypedText(fullText.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 35);
        return () => clearInterval(interval);
    }, []);

    // Auto-focus input
    useEffect(() => {
        if (showContent && inputRef.current) {
            const timer = setTimeout(() => inputRef.current?.focus(), 800);
            return () => clearTimeout(timer);
        }
    }, [showContent]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) return;

        setIsSubmitting(true);
        setError('');

        // Simulate verification delay for effect
        await new Promise(resolve => setTimeout(resolve, 600));

        const success = login(password);
        if (success) {
            // Brief success state before redirect
            await new Promise(resolve => setTimeout(resolve, 400));
            router.push('/slide/0');
        } else {
            setError('AKSES DITOLAK — KODE TIDAK VALID');
            setIsSubmitting(false);
            setPassword('');
            inputRef.current?.focus();
        }
    };

    if (isLoading) {
        return (
            <div className="login-wrapper">
                <div className="auth-loading">
                    <div className="auth-loading-spinner" />
                    <span className="auth-loading-text">INISIALISASI SISTEM...</span>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="login-wrapper">
            <div className="scanline-overlay" />

            {/* Decorative grid lines */}
            <div className="login-grid-bg" />

            <div className={`login-container ${showContent ? 'login-visible' : ''}`}>
                {/* Top classification stamp */}
                <div className="login-stamp">
                    <div className="classified-badge classified-badge-lg">
                        <span className="classified-badge-icon">◆</span>
                        SANGAT RAHASIA
                        <span className="classified-badge-icon">◆</span>
                    </div>
                </div>

                {/* Title block */}
                <div className="login-title-block">
                    <div className="login-code-label">OPERASI INTELIJEN</div>
                    <h1 className="login-title">CANDI OPS 26</h1>
                    <div className="login-subtitle">Paparan Strategi — Briefing Rahasia</div>
                </div>

                {/* Terminal-style prompt */}
                <div className="login-terminal">
                    <div className="login-terminal-header">
                        <span className="login-terminal-dot login-dot-red" />
                        <span className="login-terminal-dot login-dot-yellow" />
                        <span className="login-terminal-dot login-dot-green" />
                        <span className="login-terminal-label">SECURE TERMINAL v2.6</span>
                    </div>
                    <div className="login-terminal-body">
                        <div className="login-typing-line">
                            <span className="login-prompt-symbol">&gt;</span>
                            <span className="login-typed-text">{typedText}</span>
                            <span className="login-cursor">▊</span>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="login-input-row">
                                <span className="login-prompt-symbol">&gt;</span>
                                <span className="login-input-label">PASSWORD:</span>
                                <input
                                    ref={inputRef}
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    className="login-input"
                                    placeholder="••••••••"
                                    disabled={isSubmitting}
                                    autoComplete="off"
                                    id="login-password"
                                />
                            </div>

                            {error && (
                                <div className="login-error">
                                    <span className="login-error-icon">⚠</span>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="login-submit"
                                disabled={isSubmitting || !password.trim()}
                                id="login-submit"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="login-submit-spinner" />
                                        MEMVERIFIKASI...
                                    </>
                                ) : (
                                    <>
                                        <span className="login-submit-icon">◈</span>
                                        VERIFIKASI AKSES
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom warning */}
                <div className="login-warning">
                    <span className="login-warning-icon">⬡</span>
                    Akses tidak sah terhadap dokumen ini merupakan pelanggaran hukum
                </div>
            </div>
        </div>
    );
}
