"use client";

import { useState, useEffect } from "react";
import { gsap } from "gsap";
import ElementoSVG from "Componentes/Elementos/ElementoSVG/ElementoSVG.tsx";

export type TipoAnimacao = "pulo" | "contorno" | "glow" | "contorno-amarelo";

type AnimacaoBase = {
    tipoAnimacao: TipoAnimacao;
};

interface AnimacaoPulo extends AnimacaoBase {
    tipoAnimacao: "pulo";
    altura: number;
    duracao: number;
}

interface AnimacaoContorno extends AnimacaoBase {
    tipoAnimacao: "contorno";
    duracao: number;
}

interface AnimacaoGlow extends AnimacaoBase {
    tipoAnimacao: "glow";
    intensidade: number;
    cor: string;
    duracao: number;
}

interface AnimacaoContornoAmarelo extends AnimacaoBase {
    tipoAnimacao: "contorno-amarelo";
    duracao: number;
    cor: string;
    intervalo: number;
    fadeOutDuracao: number;
}

type AnimacaoProps = AnimacaoPulo | AnimacaoContorno | AnimacaoGlow | AnimacaoContornoAmarelo;

interface Props {
    src: string;
    className?: string;
    animacao: AnimacaoProps;
}

export default function ElementoSVGAnimado({ src, className, animacao }: Props) {
    const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgElement || !animacao.tipoAnimacao) return;

        gsap.killTweensOf(svgElement);

        switch (animacao.tipoAnimacao) {
            case "pulo": {
                const { altura, duracao } = animacao;
                gsap.to(svgElement, {
                    y: -altura,
                    duration: duracao,
                    repeat: -1,
                    yoyo: true,
                    ease: "power1.inOut",
                });
                break;
            }
            case "contorno": {
                const { duracao } = animacao;
                const paths = svgElement.querySelectorAll("path");
                paths.forEach((path) => {
                    const length = path.getTotalLength();
                    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
                    gsap.to(path, {
                        strokeDashoffset: 0,
                        duration: duracao,
                        repeat: -1,
                        ease: "power2.inOut",
                    });
                });
                break;
            }
            case "glow": {
                const { intensidade, cor, duracao } = animacao;
                gsap.set(svgElement, { filter: `drop-shadow(0px 0px 5px ${cor})` });
                gsap.to(svgElement, {
                    filter: `drop-shadow(0px 0px ${intensidade}px ${cor})`,
                    duration: duracao,
                    repeat: -1,
                    yoyo: true,
                    ease: "power1.inOut",
                });
                break;
            }
            case "contorno-amarelo": {
                const { duracao, cor, intervalo, fadeOutDuracao } = animacao;
                const paths = svgElement.querySelectorAll("path");
                paths.forEach((path) => {
                    const length = path.getTotalLength();
                    const clone = path.cloneNode() as SVGPathElement;
                    clone.setAttribute("stroke", cor);
                    clone.setAttribute("stroke-width", "2");
                    clone.setAttribute("fill", "none");
                    path.parentNode?.appendChild(clone);
                    gsap.set(clone, { strokeDasharray: length / 5, strokeDashoffset: length, opacity: 0 });
                    
                    function animate() {
                        gsap.set(clone, { strokeDashoffset: length, opacity: 0 }); // Reset antes de iniciar
                        gsap.to(clone, {
                            opacity: 1,
                            strokeDashoffset: 0,
                            duration: duracao,
                            ease: "power2.inOut",
                            onComplete: () => {
                                gsap.to(clone, {
                                    opacity: 0,
                                    duration: fadeOutDuracao,
                                    delay: duracao - fadeOutDuracao, // Garante que o fadeout termine antes do fim
                                    onComplete: () => {
                                        setTimeout(animate, intervalo * 1000);
                                    }
                                });
                            },
                        });
                    }
                    animate();
                });
                break;
            }
            default:
                break;
        }
    }, [svgElement, animacao]);

    return <ElementoSVG src={src} className={className} afterInjection={setSvgElement} />;
}