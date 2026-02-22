'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import SlideLayout from '@/components/SlideLayout';
import SlideContent from '@/components/SlideContent';

const NetworkGraph = dynamic(() => import('@/components/NetworkGraph'), { ssr: false });

interface SlideViewProps {
    slideData: {
        id: number;
        title: string;
        classification: string;
        slideType: string;
        content: string;
    };
    totalSlides: number;
}

export default function SlideView({ slideData, totalSlides }: SlideViewProps) {
    return (
        <SlideLayout
            currentSlide={slideData.id}
            totalSlides={totalSlides}
            classification={slideData.classification}
            slideType={slideData.slideType}
        >
            {slideData.slideType === 'network' && <NetworkGraph />}
            <SlideContent content={slideData.content} slideType={slideData.slideType} />
        </SlideLayout>
    );
}

