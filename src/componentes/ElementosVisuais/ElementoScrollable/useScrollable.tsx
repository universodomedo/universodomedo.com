import { useEffect, useRef, useState } from 'react';

export default function useScrollable (hideTimeout = 1000) {
    const [isScrolling, setIsScrolling] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleScroll = () => {
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
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        'data-scrollable': true,
        'data-scrolling': isScrolling,
        'data-hovered': isHovered
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