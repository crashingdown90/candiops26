'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ActorData {
    slug: string;
    title: string;
    content: string;
    group?: string;
    foto?: string;
    classification: string;
}

interface ActorListSlideProps {
    actors: ActorData[];
}

// Define group order and icons
const GROUP_CONFIG: Record<string, { icon: string; color: string }> = {
    'Pimpinan Eksekutif': { icon: '🔴', color: 'var(--gold)' },
    'Lingkaran Strategis': { icon: '🟡', color: '#e6c84a' },
    'Pimpinan DPRD': { icon: '🔵', color: '#5b9bd5' },
    'Tim Humas & Media': { icon: '🟢', color: '#6bc950' },
    'Redaksi Suara Merdeka': { icon: '📰', color: '#d4a84b' },
    'Aktor Eksternal & Kingmaker': { icon: '⚫', color: '#a0a0a0' },
    'Lainnya': { icon: '⚪', color: '#888' },
};

const GROUP_ORDER = [
    'Pimpinan Eksekutif',
    'Lingkaran Strategis',
    'Pimpinan DPRD',
    'Tim Humas & Media',
    'Redaksi Suara Merdeka',
    'Aktor Eksternal & Kingmaker',
    'Lainnya',
];

// Extract name and role from title
function parseTitle(title: string): { name: string; role: string } {
    const match = title.match(/Profil:\s*(.+?)(?:\s*—\s*(.+))?$/);
    if (match) {
        return { name: match[1].trim(), role: match[2]?.trim() || '' };
    }
    return { name: title, role: '' };
}

export default function ActorListSlide({ actors }: ActorListSlideProps) {
    const [selectedActor, setSelectedActor] = useState<ActorData | null>(null);

    // Group actors
    const grouped: Record<string, ActorData[]> = {};
    for (const actor of actors) {
        const group = actor.group || 'Lainnya';
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(actor);
    }

    return (
        <>
            <div className="actor-grid">
                <h1>Daftar Profil Aktor</h1>
                <p className="actor-grid-subtitle">Klik nama aktor untuk melihat profil lengkap • {actors.length} aktor terpetakan</p>

                {GROUP_ORDER.map((groupName) => {
                    const groupActors = grouped[groupName];
                    if (!groupActors || groupActors.length === 0) return null;
                    const config = GROUP_CONFIG[groupName] || GROUP_CONFIG['Lainnya'];

                    return (
                        <div key={groupName} className="actor-group">
                            <div className="actor-group-header">
                                <span className="actor-group-icon">{config.icon}</span>
                                <span className="actor-group-name">{groupName}</span>
                                <span className="actor-group-count">{groupActors.length}</span>
                            </div>
                            <div className="actor-list">
                                {groupActors.map((actor) => {
                                    const { name, role } = parseTitle(actor.title);
                                    return (
                                        <button
                                            key={actor.slug}
                                            className="actor-card"
                                            onClick={() => setSelectedActor(actor)}
                                        >
                                            <span className="actor-card-name">{name}</span>
                                            {role && <span className="actor-card-role">{role}</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedActor && (
                <div className="actor-modal-overlay" onClick={() => setSelectedActor(null)}>
                    <div className="actor-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="actor-modal-close" onClick={() => setSelectedActor(null)}>
                            ✕
                        </button>
                        <div className="actor-modal-body markdown-body">
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
                                }}
                            >
                                {selectedActor.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
