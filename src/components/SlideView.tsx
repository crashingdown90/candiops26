'use client';

import React from 'react';
import SlideLayout from '@/components/SlideLayout';
import SlideContent from '@/components/SlideContent';

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
            <SlideContent content={slideData.content} slideType={slideData.slideType} />
        </SlideLayout>
    );
}
