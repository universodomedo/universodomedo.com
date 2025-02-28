"use client";

import EmbrulhoSVG from 'Componentes/Elementos/EmbrulhoSVG/EmbrulhoSVG.tsx';

interface Props {
    src: string;
    className?: string;
    afterInjection?: (svg: SVGSVGElement) => void;
}

export default function ElementoSVG({ src, className, afterInjection }: Props) {
    return <EmbrulhoSVG src={src} className={className} afterInjection={afterInjection} />;
}