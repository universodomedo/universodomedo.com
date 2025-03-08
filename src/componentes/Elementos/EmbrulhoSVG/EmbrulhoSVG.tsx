"use client";

import { ReactSVG } from "react-svg";

export default function EmbrulhoSVG({ src, className, afterInjection }: { src: string; className?: string; afterInjection?: (svg: SVGSVGElement) => void}) {
    return <ReactSVG wrapper='span' src={src} className={className} afterInjection={afterInjection} />;
}