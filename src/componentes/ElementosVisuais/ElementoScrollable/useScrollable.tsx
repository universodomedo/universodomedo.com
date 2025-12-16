import { useEffect, useRef, useState } from 'react';

interface UseScrollableOptions {
    modo?: 'sempreVisivel' | 'visivelQuandoInteragindo';
    hideTimeout?: number;
};

export default function useScrollable(options: UseScrollableOptions = {}) {
    const { modo = 'visivelQuandoInteragindo', hideTimeout = 1000 } = options;

    const [isScrolling, setIsScrolling] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isTouch, setIsTouch] = useState(false);
    const [node, setNode] = useState<HTMLElement | null>(null);

    const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const elRef = useRef<HTMLElement | null>(null);
    const raf = useRef<number | null>(null);

    const updateThumbVars = (forceVisible?: boolean) => {
        const el = elRef.current;
        if (!isTouch || !el) return;

        const client = el.clientHeight;
        const scroll = el.scrollHeight;

        if (scroll <= client + 1) {
            el.style.setProperty('--sb-opacity', '0');
            return;
        }

        const minH = 24;
        const thumbH = Math.max(Math.round(client * (client / scroll)), minH);

        const maxTop = client - thumbH;
        const maxScroll = scroll - client;
        const top = maxScroll > 0 ? Math.round((el.scrollTop / maxScroll) * maxTop) : 0;

        const visible = forceVisible ?? (modo === 'sempreVisivel' ? true : isScrolling || isHovered);

        el.style.setProperty('--sb-top', `${top + el.scrollTop}px`);
        el.style.setProperty('--sb-height', `${thumbH}px`);
        el.style.setProperty('--sb-opacity', visible ? '1' : '0');
    };

    const scheduleUpdate = (forceVisible?: boolean) => {
        if (!isTouch) return;
        if (raf.current) return;
        raf.current = requestAnimationFrame(() => {
            raf.current = null;
            updateThumbVars(forceVisible);
        });
    };

    const handleScroll = (e?: any) => {
        if (e?.currentTarget) elRef.current = e.currentTarget as HTMLElement;
        updateThumbVars(true);

        if (modo !== 'visivelQuandoInteragindo') return;

        setIsScrolling(true);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
            setIsScrolling(false);
            updateThumbVars(false);
        }, hideTimeout);
    };

    useEffect(() => {
        const media = window.matchMedia('(hover: none) and (pointer: coarse)');
        const update = () => setIsTouch(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        if (!isTouch || !node) return;
        const onScroll = () => scheduleUpdate(true);
        node.addEventListener('scroll', onScroll, { passive: true });
        return () => node.removeEventListener('scroll', onScroll);
    }, [isTouch, node]);

    useEffect(() => {
        scheduleUpdate();
    }, [isTouch, modo, isScrolling, isHovered]);

    useEffect(() => {
        return () => {
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            if (raf.current) cancelAnimationFrame(raf.current);
        };
    }, []);

    const scrollableProps = {
        ref: (node: HTMLElement | null) => {
            elRef.current = node;
            updateThumbVars();
        },
        onScroll: handleScroll,
        onTouchStart: (e: any) => handleScroll(e),
        onTouchMove: (e: any) => handleScroll(e),
        onMouseEnter: () => {
            if (modo === 'visivelQuandoInteragindo') setIsHovered(true);
            updateThumbVars(true);
        },
        onMouseLeave: () => {
            if (modo === 'visivelQuandoInteragindo') setIsHovered(false);
            updateThumbVars(false);
        },
        'data-scrollable': true,
        'data-scrolling': isScrolling,
        'data-hovered': isHovered,
        'data-visibility-mode': modo,
        'data-custom-scrollbar': isTouch
    };

    return { scrollableProps };
};