'use client';

import type { MouseEvent } from 'react';

import styles from './SeletorPosicaoMapa.module.css';

type PosicaoMapa = { x: number; y: number };
type MarcadorContexto = { key: string; posicao: PosicaoMapa; rotulo: string };

type Props = {
    larguraMilimetros: number;
    alturaMilimetros: number;
    posicao: PosicaoMapa;
    aoMudarPosicao: (posicao: PosicaoMapa) => void;
    rotuloAtivo: string;
    marcadoresContexto?: readonly MarcadorContexto[];
};

function arredondaMilimetros(valor: number): number {
    return Math.round(valor);
};

function percentual(valor: number, extensao: number): string {
    if (extensao <= 0) return '0%';
    return `${Math.min(Math.max(valor / extensao, 0), 1) * 100}%`;
};

// Picker de posicao no mapa logico: clicar posiciona o Ser com precisao milimetrica, sem snap de celula.
// A fracao do clique e invariante a escala global do app: rect e clientX vivem no mesmo espaco de tela pos-escala.
export function SeletorPosicaoMapa({ larguraMilimetros, alturaMilimetros, posicao, aoMudarPosicao, rotuloAtivo, marcadoresContexto = [] }: Props) {
    function aoClicar(evento: MouseEvent<HTMLDivElement>): void {
        const retangulo = evento.currentTarget.getBoundingClientRect();
        if (retangulo.width <= 0 || retangulo.height <= 0) return;
        const fracaoX = (evento.clientX - retangulo.left) / retangulo.width;
        const fracaoY = (evento.clientY - retangulo.top) / retangulo.height;
        const x = arredondaMilimetros(Math.min(Math.max(fracaoX, 0), 1) * larguraMilimetros);
        const y = arredondaMilimetros(Math.min(Math.max(fracaoY, 0), 1) * alturaMilimetros);
        aoMudarPosicao({ x, y });
    };

    return (
        <div className={styles.seletor}>
            <div className={styles.mapa} style={{ aspectRatio: `${larguraMilimetros} / ${alturaMilimetros}` }} onClick={aoClicar}>
                {marcadoresContexto.map(marcador => (
                    <span key={marcador.key} className={styles.marcador_contexto} style={{ left: percentual(marcador.posicao.x, larguraMilimetros), top: percentual(marcador.posicao.y, alturaMilimetros) }} title={marcador.rotulo}>
                        <span className={styles.ponto_contexto} />
                    </span>
                ))}
                <span className={styles.marcador_ativo} style={{ left: percentual(posicao.x, larguraMilimetros), top: percentual(posicao.y, alturaMilimetros) }} title={rotuloAtivo}>
                    <span className={styles.ponto_ativo} />
                </span>
            </div>
            <p className={styles.leitura}>{posicao.x}mm, {posicao.y}mm — mapa {larguraMilimetros}mm × {alturaMilimetros}mm. Clique para posicionar.</p>
        </div>
    );
};
