import { notFound } from 'next/navigation';
import { getAllSlides, getAllActors, getTotalSlides } from '@/lib/slides';
import SlideView from '@/components/SlideView';
import ActorSlideView from '@/components/ActorSlideView';

interface SlidePageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    const total = getTotalSlides();
    return Array.from({ length: total }, (_, i) => ({
        id: String(i),
    }));
}

export async function generateMetadata({ params }: SlidePageProps) {
    const { id } = await params;
    const slideId = parseInt(id, 10);
    const slides = getAllSlides();
    const slide = slides[slideId];

    if (!slide) return { title: 'Not Found' };

    return {
        title: `${slide.title} — CANDI OPS 26`,
        description: `Briefing slide: ${slide.title}`,
    };
}

export default async function SlidePage({ params }: SlidePageProps) {
    const { id } = await params;
    const slideId = parseInt(id, 10);
    const slides = getAllSlides();

    if (isNaN(slideId) || slideId < 0 || slideId >= slides.length) {
        notFound();
    }

    const slide = slides[slideId];

    // Special handling for actor list slide
    if (slide.slideType === 'actor-list') {
        const actors = getAllActors();
        return (
            <ActorSlideView
                slideData={{
                    id: slide.id,
                    title: slide.title,
                    classification: slide.classification,
                    slideType: slide.slideType,
                    content: slide.content,
                }}
                actors={actors}
                totalSlides={slides.length}
            />
        );
    }

    return (
        <SlideView
            slideData={{
                id: slide.id,
                title: slide.title,
                classification: slide.classification,
                slideType: slide.slideType,
                content: slide.content,
            }}
            totalSlides={slides.length}
        />
    );
}
