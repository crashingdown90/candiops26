'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gmniNetworkData, NetworkNode, NetworkEdge } from '@/lib/networkData';

interface PositionedNode extends NetworkNode {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

interface TooltipInfo {
    x: number;
    y: number;
    node: PositionedNode;
}

const NODE_COLORS: Record<string, string> = {
    actor: '#c4a35a',
    party: '#4a90d9',
    organization: '#2a9d8f',
    position: '#e07a5f',
};

const EDGE_COLORS: Record<string, string> = {
    patronase: '#e63946',
    rekomendasi: '#f4a261',
    afiliasi: '#4a90d9',
    alumni: '#2a9d8f',
    jabatan: '#9b59b6',
};

const EDGE_DASHES: Record<string, number[]> = {
    patronase: [],
    rekomendasi: [8, 4],
    afiliasi: [4, 4],
    alumni: [2, 6],
    jabatan: [],
};

const GROUP_COLORS: Record<string, string> = {
    PDIP: '#dc2626',
    Gerindra: '#7c3aed',
    Golkar: '#eab308',
    PKB: '#16a34a',
    PPP: '#0ea5e9',
    PKS: '#f97316',
    'Non-Partai': '#9ca3af',
};

function getNodeColor(node: PositionedNode): string {
    if (node.color) return node.color;
    if (node.type === 'actor' && node.group) {
        return GROUP_COLORS[node.group] || NODE_COLORS.actor;
    }
    return NODE_COLORS[node.type] || '#c4a35a';
}

function getNodeRadius(node: NetworkNode, scale: number = 1): number {
    const base = node.pulse ? 28 : (
        node.type === 'actor' ? 22 :
            node.type === 'organization' ? 18 :
                node.type === 'party' ? 16 :
                    node.type === 'position' ? 18 : 16
    );
    return Math.max(base * scale, node.pulse ? 16 : 10);
}

export default function NetworkGraph() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const animFrameRef = useRef<number>(0);
    const nodesRef = useRef<PositionedNode[]>([]);
    const edgesRef = useRef<NetworkEdge[]>([]);
    const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState({ width: 900, height: 520 });
    const timeRef = useRef(0);
    const initializedRef = useRef(false);

    // Initialize nodes with positions — scales to canvas size
    const initializeNodes = useCallback((w: number, h: number) => {
        const cx = w / 2;
        const cy = h / 2;
        const data = gmniNetworkData;

        // Scale factor relative to reference width of 900px
        const sx = w / 900;
        const sy = h / 520;

        // Define positions as offsets from center, scaled
        const rawPositions: Record<string, { dx: number; dy: number }> = {
            // Central GMNI triangle
            'gmni': { dx: 0, dy: -60 },
            'pacul': { dx: -120, dy: -160 },
            'heri': { dx: 120, dy: -40 },
            'zulkifli': { dx: 30, dy: 80 },

            // TPPD
            'tppd': { dx: 160, dy: 150 },

            // Other actors
            'lutfi': { dx: 260, dy: -120 },
            'sumanto': { dx: -260, dy: -60 },
            'saleh': { dx: 220, dy: 60 },
            'sarif': { dx: -160, dy: 120 },
            'taj': { dx: -240, dy: 60 },
            'setya': { dx: -100, dy: 180 },

            // Organizations
            'pmii': { dx: 60, dy: 180 },
            'hmi': { dx: -50, dy: 130 },
            'kammi': { dx: 80, dy: 130 },
            'kosgoro': { dx: 320, dy: 120 },

            // Parties - outer ring
            'pdip': { dx: -340, dy: -150 },
            'gerindra': { dx: 340, dy: -80 },
            'golkar': { dx: 340, dy: 180 },
            'pkb': { dx: -280, dy: 170 },
            'ppp': { dx: -340, dy: 130 },
            'pks': { dx: -200, dy: 200 },
        };

        const radiusScale = Math.min(sx, 1);

        const nodes: PositionedNode[] = data.nodes.map((n) => {
            const raw = rawPositions[n.id];
            const pos = raw
                ? { x: cx + raw.dx * sx, y: cy + raw.dy * sy }
                : { x: cx + (Math.random() - 0.5) * w * 0.6, y: cy + (Math.random() - 0.5) * h * 0.6 };

            // Clamp to bounds with padding
            const r = getNodeRadius(n, radiusScale);
            const pad = r + 20;
            pos.x = Math.max(pad, Math.min(w - pad, pos.x));
            pos.y = Math.max(pad, Math.min(h - pad, pos.y));

            return {
                ...n,
                x: pos.x,
                y: pos.y,
                vx: 0,
                vy: 0,
                radius: r,
            };
        });

        nodesRef.current = nodes;
        edgesRef.current = data.edges;
        initializedRef.current = true;
    }, []);

    // Draw the network
    const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
        const nodes = nodesRef.current;
        const edges = edgesRef.current;
        const dpr = window.devicePixelRatio || 1;

        ctx.clearRect(0, 0, w * dpr, h * dpr);
        ctx.save();
        ctx.scale(dpr, dpr);

        // Background grid
        ctx.strokeStyle = 'rgba(196, 163, 90, 0.03)';
        ctx.lineWidth = 0.5;
        const gridSize = 40;
        for (let x = 0; x < w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Crosshair at center
        ctx.strokeStyle = 'rgba(196, 163, 90, 0.06)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        const nodeMap = new Map<string, PositionedNode>();
        nodes.forEach(n => nodeMap.set(n.id, n));

        // Draw edges
        edges.forEach(edge => {
            const source = nodeMap.get(edge.source);
            const target = nodeMap.get(edge.target);
            if (!source || !target) return;

            const isHighlighted = hoveredNode === edge.source || hoveredNode === edge.target;
            const isDimmed = hoveredNode && !isHighlighted;

            ctx.save();
            ctx.strokeStyle = isDimmed
                ? 'rgba(100, 100, 100, 0.08)'
                : isHighlighted
                    ? EDGE_COLORS[edge.type] || '#4a90d9'
                    : `${EDGE_COLORS[edge.type] || '#4a90d9'}55`;
            ctx.lineWidth = isHighlighted ? 2.5 : (edge.strength && edge.strength >= 3 ? 1.8 : 1);

            const dash = EDGE_DASHES[edge.type] || [];
            ctx.setLineDash(dash);

            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();

            // Animated flow particles on highlighted edges
            if (isHighlighted && edge.type === 'patronase') {
                const progress = (time * 0.001) % 1;
                const px = source.x + (target.x - source.x) * progress;
                const py = source.y + (target.y - source.y) * progress;
                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fillStyle = EDGE_COLORS[edge.type];
                ctx.fill();
            }

            // Edge label
            if (edge.label && (isHighlighted || !hoveredNode)) {
                const mx = (source.x + target.x) / 2;
                const my = (source.y + target.y) / 2;
                ctx.font = `${isHighlighted ? '600' : '400'} 9px "JetBrains Mono", monospace`;
                ctx.fillStyle = isDimmed ? 'rgba(100, 100, 100, 0.1)' : isHighlighted ? EDGE_COLORS[edge.type] : 'rgba(156, 163, 175, 0.5)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Background for label
                const textWidth = ctx.measureText(edge.label).width;
                ctx.fillStyle = 'rgba(12, 17, 23, 0.85)';
                ctx.fillRect(mx - textWidth / 2 - 4, my - 7, textWidth + 8, 14);
                ctx.fillStyle = isDimmed ? 'rgba(100, 100, 100, 0.15)' : isHighlighted ? EDGE_COLORS[edge.type] : 'rgba(156, 163, 175, 0.5)';
                ctx.fillText(edge.label, mx, my);
            }

            ctx.restore();
        });

        // Draw nodes
        nodes.forEach(node => {
            const isHovered = hoveredNode === node.id;
            const isConnected = hoveredNode && edges.some(
                e => (e.source === hoveredNode && e.target === node.id) ||
                    (e.target === hoveredNode && e.source === node.id)
            );
            const isDimmed = hoveredNode && !isHovered && !isConnected;
            const color = getNodeColor(node);
            const r = node.radius;

            ctx.save();

            // Glow effect
            if ((node.pulse || isHovered) && !isDimmed) {
                const pulseScale = node.pulse ? 1 + Math.sin(time * 0.002) * 0.15 : 1.2;
                const gradient = ctx.createRadialGradient(
                    node.x, node.y, r * 0.5,
                    node.x, node.y, r * 2 * pulseScale
                );
                gradient.addColorStop(0, `${color}30`);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(node.x, node.y, r * 2 * pulseScale, 0, Math.PI * 2);
                ctx.fill();
            }

            // Node circle
            ctx.globalAlpha = isDimmed ? 0.15 : 1;
            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, Math.PI * 2);

            // Fill
            const fillGrad = ctx.createRadialGradient(
                node.x - r * 0.3, node.y - r * 0.3, 0,
                node.x, node.y, r
            );
            fillGrad.addColorStop(0, `${color}40`);
            fillGrad.addColorStop(1, `${color}15`);
            ctx.fillStyle = fillGrad;
            ctx.fill();

            // Border
            ctx.strokeStyle = isHovered ? color : `${color}88`;
            ctx.lineWidth = isHovered ? 2.5 : node.pulse ? 2 : 1.5;
            ctx.stroke();

            // Icon/symbol inside node
            ctx.fillStyle = isDimmed ? `${color}40` : color;
            ctx.font = `700 ${r * 0.55}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            let icon = '';
            switch (node.type) {
                case 'actor': icon = '●'; break;
                case 'party': icon = '◆'; break;
                case 'organization': icon = '▲'; break;
                case 'position': icon = '★'; break;
            }
            ctx.fillText(icon, node.x, node.y);

            // Label below node
            ctx.font = `600 ${node.type === 'actor' ? 10 : 9}px "Inter", -apple-system, sans-serif`;
            ctx.fillStyle = isDimmed ? 'rgba(200,200,200, 0.1)' : isHovered ? '#edf0f4' : 'rgba(209, 213, 219, 0.85)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(node.label, node.x, node.y + r + 5);

            // Subtitle on hover
            if (isHovered && node.subtitle) {
                const lines = node.subtitle.split('\n');
                ctx.font = '400 8px "JetBrains Mono", monospace';
                ctx.fillStyle = 'rgba(156, 163, 175, 0.8)';
                lines.forEach((line, i) => {
                    ctx.fillText(line, node.x, node.y + r + 18 + i * 12);
                });
            }

            ctx.restore();
        });

        // Legend
        ctx.save();
        ctx.globalAlpha = hoveredNode ? 0.3 : 0.7;
        const legendX = 14;
        let legendY = h - 95;
        ctx.font = '600 8px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(196, 163, 90, 0.6)';
        ctx.textAlign = 'left';
        ctx.fillText('LEGEND', legendX, legendY);
        legendY += 14;

        const legendItems = [
            { icon: '●', label: 'Aktor', color: '#c4a35a' },
            { icon: '▲', label: 'Organisasi', color: '#2a9d8f' },
            { icon: '◆', label: 'Partai', color: '#4a90d9' },
            { icon: '★', label: 'Jabatan', color: '#e07a5f' },
        ];

        legendItems.forEach(item => {
            ctx.fillStyle = item.color;
            ctx.font = '700 9px "JetBrains Mono", monospace';
            ctx.fillText(item.icon, legendX, legendY);
            ctx.fillStyle = 'rgba(156, 163, 175, 0.7)';
            ctx.font = '400 8px "Inter", sans-serif';
            ctx.fillText(item.label, legendX + 14, legendY);
            legendY += 14;
        });

        // Edge type legend
        legendY += 4;
        const edgeLegend = [
            { label: 'Patronase', color: EDGE_COLORS.patronase, dash: [] },
            { label: 'Rekomendasi', color: EDGE_COLORS.rekomendasi, dash: [8, 4] },
            { label: 'Afiliasi', color: EDGE_COLORS.afiliasi, dash: [4, 4] },
        ];

        edgeLegend.forEach(item => {
            ctx.strokeStyle = item.color;
            ctx.lineWidth = 1.5;
            ctx.setLineDash(item.dash);
            ctx.beginPath();
            ctx.moveTo(legendX, legendY - 3);
            ctx.lineTo(legendX + 18, legendY - 3);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = 'rgba(156, 163, 175, 0.7)';
            ctx.font = '400 8px "Inter", sans-serif';
            ctx.fillText(item.label, legendX + 24, legendY);
            legendY += 14;
        });

        ctx.restore();

        // Title overlay
        ctx.save();
        ctx.globalAlpha = hoveredNode ? 0.2 : 0.5;
        ctx.font = '600 9px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(196, 163, 90, 0.6)';
        ctx.textAlign = 'right';
        ctx.fillText('SNA // PETA JARINGAN AFILIASI', w - 14, 18);
        ctx.font = '400 8px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(156, 163, 175, 0.5)';
        ctx.fillText('GMNI — LINTAS ORGANISASI MAHASISWA', w - 14, 30);
        ctx.restore();

        ctx.restore();
    }, [hoveredNode]);

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const animate = (timestamp: number) => {
            timeRef.current = timestamp;
            draw(ctx, dimensions.width, dimensions.height, timestamp);
            animFrameRef.current = requestAnimationFrame(animate);
        };

        animFrameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, [draw, dimensions]);

    // Resize observer
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const resizeObs = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry) {
                const w = entry.contentRect.width;
                // Taller ratio on mobile for better node spacing
                const ratio = w < 500 ? 0.75 : 0.55;
                const h = Math.min(Math.max(w * ratio, 300), 600);
                setDimensions({ width: w, height: h });
            }
        });

        resizeObs.observe(container);
        return () => resizeObs.disconnect();
    }, []);

    // Initialize/reinitialize nodes on dimension change
    useEffect(() => {
        if (dimensions.width > 0) {
            initializeNodes(dimensions.width, dimensions.height);
        }
    }, [dimensions, initializeNodes]);

    // Set canvas size
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = dimensions.width * dpr;
        canvas.height = dimensions.height * dpr;
        canvas.style.width = `${dimensions.width}px`;
        canvas.style.height = `${dimensions.height}px`;
    }, [dimensions]);

    // Mouse interaction
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        let found: PositionedNode | null = null;
        for (const node of nodesRef.current) {
            const dx = mx - node.x;
            const dy = my - node.y;
            if (dx * dx + dy * dy < (node.radius + 8) * (node.radius + 8)) {
                found = node;
                break;
            }
        }

        if (found) {
            setHoveredNode(found.id);
            setTooltip({ x: e.clientX, y: e.clientY, node: found });
            canvas.style.cursor = 'pointer';
        } else {
            setHoveredNode(null);
            setTooltip(null);
            canvas.style.cursor = 'default';
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredNode(null);
        setTooltip(null);
    }, []);

    // Touch interaction for mobile
    const handleTouch = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        if (!touch) return;
        const mx = touch.clientX - rect.left;
        const my = touch.clientY - rect.top;

        let found: PositionedNode | null = null;
        for (const node of nodesRef.current) {
            const dx = mx - node.x;
            const dy = my - node.y;
            if (dx * dx + dy * dy < (node.radius + 12) * (node.radius + 12)) {
                found = node;
                break;
            }
        }

        if (found) {
            e.preventDefault();
            setHoveredNode(found.id);
            setTooltip({ x: touch.clientX, y: touch.clientY, node: found });
        } else {
            setHoveredNode(null);
            setTooltip(null);
        }
    }, []);

    return (
        <div className="network-graph-container" ref={containerRef}>
            <canvas
                ref={canvasRef}
                className="network-canvas"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouch}
                onTouchMove={handleTouch}
            />
            {tooltip && (
                <div
                    className="network-tooltip"
                    style={{
                        left: tooltip.x + 16,
                        top: tooltip.y - 10,
                    }}
                >
                    <div className="network-tooltip-name">{tooltip.node.label}</div>
                    {tooltip.node.subtitle && (
                        <div className="network-tooltip-detail">
                            {tooltip.node.subtitle.split('\n').map((line, i) => (
                                <div key={i}>{line}</div>
                            ))}
                        </div>
                    )}
                    {tooltip.node.group && (
                        <div className="network-tooltip-group">
                            <span className="network-tooltip-dot" style={{ background: GROUP_COLORS[tooltip.node.group] || '#c4a35a' }} />
                            {tooltip.node.group}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
