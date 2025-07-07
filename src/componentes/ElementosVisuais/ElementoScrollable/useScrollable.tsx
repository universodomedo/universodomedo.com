import { useEffect, useRef, useState } from 'react';

interface UseScrollableOptions {
    modo?: 'sempreVisivel' | 'visivelQuandoInteragindo';
    hideTimeout?: number;
}

export default function useScrollable (options: UseScrollableOptions = {}) {
    const { modo = 'visivelQuandoInteragindo', hideTimeout = 1000 } = options;

    const [isScrolling, setIsScrolling] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleScroll = () => {
        if (modo !== 'visivelQuandoInteragindo') return;

        setIsScrolling(true);

        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }

        scrollTimeout.current = setTimeout(() => {
            setIsScrolling(false);
        }, hideTimeout);
    };

    const scrollableProps = {
        onScroll: handleScroll,
        onMouseEnter: () => {
            if (modo === 'visivelQuandoInteragindo') setIsHovered(true);
        },
        onMouseLeave: () => {
            if (modo === 'visivelQuandoInteragindo') setIsHovered(false);
        },
        'data-scrollable': true,
        'data-scrolling': isScrolling,
        'data-hovered': isHovered,
        'data-visibility-mode': modo
    };

    useEffect(() => {
        return () => {
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
        };
    }, []);

    return { scrollableProps };
};