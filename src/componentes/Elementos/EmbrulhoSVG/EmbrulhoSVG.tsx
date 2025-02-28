"use client";

import { ReactSVG } from "react-svg";

interface Props {
    src: string;
    className?: string;
    afterInjection?: (svg: SVGSVGElement) => void;
}

export default function EmbrulhoSVG({ src, className, afterInjection }: Props) {
    return <ReactSVG src={src} className={className} afterInjection={afterInjection} />;
}