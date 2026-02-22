'use client';

import React from 'react';
import SlideLayout from '@/components/SlideLayout';
import ActorListSlide from '@/components/ActorListSlide';

interface ActorSlideViewProps {
    slideData: {
        id: number;
        title: string;
        classification: string;
        slideType: string;
        content: string;
    };
    actors: {
        slug: string;
        title: string;
        content: string;
        group?: string;
        foto?: string;
        classification: string;
    }[];
    totalSlides: number;
}

export default function ActorSlideView({ slideData, actors, totalSlides }: ActorSlideViewProps) {
    return (
        <SlideLayout
            currentSlide={slideData.id}
            totalSlides={totalSlides}
            classification={slideData.classification}
            slideType={slideData.slideType}
        >
            <ActorListSlide actors={actors} />
        </SlideLayout>
    );
}
