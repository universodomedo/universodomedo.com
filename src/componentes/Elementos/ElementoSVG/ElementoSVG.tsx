"use client";

import EmbrulhoSVG from 'Componentes/Elementos/EmbrulhoSVG/EmbrulhoSVG.tsx';

export default function ElementoSVG({ src, className, afterInjection }: { src: string; className?: string; afterInjection?: (svg: SVGSVGElement) => void; }) {
    return <EmbrulhoSVG src={src} className={className} afterInjection={afterInjection} />;
}