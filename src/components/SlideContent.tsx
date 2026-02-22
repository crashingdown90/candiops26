'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SlideContentProps {
    content: string;
    slideType?: string;
}

export default function SlideContent({ content, slideType = 'content' }: SlideContentProps) {
    return (
        <div className={`slide-content slide-type-${slideType}`}>
            <div className="markdown-body">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        img: ({ src, alt, ...props }) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={src}
                                alt={alt || 'Foto Profil'}
                                className="profile-photo"
                                loading="eager"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                                {...props}
                            />
                        ),
                        table: ({ children, ...props }) => (
                            <div className="table-scroll-wrapper">
                                <table {...props}>{children}</table>
                            </div>
                        ),
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}
