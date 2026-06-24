'use client';

import { useCallback, useRef, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import styles from './styles.module.css';

import { type ClimaItemEdicao, type DimensaoClimaOpcao } from 'Contextos/Contexto__PaginaConfigurarMusica__Edicao/contexto';

type Props = {
    climaItens: ClimaItemEdicao[];
    dimensoesCatalogo: DimensaoClimaOpcao[];
    onAdicionar: (idDimensao: number) => void;
    onSetNivel: (idDimensao: number, nivel: number) => void;
    onRemover: (idDimensao: number) => void;
};

function rotuloDimensao(dimensao: DimensaoClimaOpcao): string { return dimensao.bipolar && dimensao.rotuloOposto ? `${dimensao.rotuloOposto} ⟷ ${dimensao.nome}` : dimensao.nome; };

export default function PainelClima({ climaItens, dimensoesCatalogo, onAdicionar, onSetNivel, onRemover }: Props) {
    const idsAdicionados = new Set(climaItens.map(item => item.idDimensao));
    const disponiveis = dimensoesCatalogo.filter(dimensao => !idsAdicionados.has(dimensao.id));
    const dimensaoPorId = new Map(dimensoesCatalogo.map(dimensao => [dimensao.id, dimensao]));

    return (
        <section className={styles.painel}>
            <h3 className={styles.titulo}>Clima</h3>

            <select className={styles.adicionar} value="" onChange={evento => { if (evento.target.value) onAdicionar(Number(evento.target.value)); }} disabled={disponiveis.length === 0}>
                <option value="">{disponiveis.length === 0 ? 'Todas as dimensões adicionadas' : '＋ Adicionar dimensão'}</option>
                {disponiveis.map(dimensao => <option key={dimensao.id} value={dimensao.id}>{rotuloDimensao(dimensao)}</option>)}
            </select>

            <div className={styles.lista}>
                {climaItens.map(item => {
                    const dimensao = dimensaoPorId.get(item.idDimensao);
                    const bipolar = dimensao?.bipolar ?? false;
                    const nome = dimensao?.nome ?? `#${item.idDimensao}`;
                    const oposto = bipolar ? (dimensao?.rotuloOposto ?? '') : '';
                    const valorTexto = bipolar && item.nivel > 0 ? `+${item.nivel}` : `${item.nivel}`;
                    return (
                        <div key={item.idDimensao} className={styles.linha}>
                            <span className={styles.poloEsquerdo}>{oposto}</span>
                            <SliderClima min={bipolar ? -10 : 0} max={10} valor={item.nivel} bipolar={bipolar} onChange={nivel => onSetNivel(item.idDimensao, nivel)} />
                            <span className={styles.poloDireito}>{nome}</span>
                            <span className={styles.valor}>{valorTexto}</span>
                            <button type="button" className={styles.remover} onClick={() => onRemover(item.idDimensao)} aria-label="Remover dimensão">✕</button>
                        </div>
                    );
                })}
                {climaItens.length === 0 ? <p className={styles.vazio}>Nenhuma dimensão marcada.</p> : null}
            </div>
        </section>
    );
};

function SliderClima({ min, max, valor, bipolar, onChange }: { min: number; max: number; valor: number; bipolar: boolean; onChange: (nivel: number) => void; }) {
    const trilhaRef = useRef<HTMLDivElement | null>(null);

    const aplicarDoPonteiro = useCallback((clientX: number) => {
        const trilha = trilhaRef.current;
        if (!trilha) return;
        const rect = trilha.getBoundingClientRect();
        if (rect.width <= 0) return;
        const razao = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        onChange(Math.round(min + razao * (max - min)));
    }, [min, max, onChange]);

    const aoPressionar = useCallback((evento: ReactPointerEvent<HTMLDivElement>) => { evento.currentTarget.setPointerCapture(evento.pointerId); aplicarDoPonteiro(evento.clientX); }, [aplicarDoPonteiro]);
    const aoMover = useCallback((evento: ReactPointerEvent<HTMLDivElement>) => { if (evento.buttons !== 0) aplicarDoPonteiro(evento.clientX); }, [aplicarDoPonteiro]);
    const aoTeclar = useCallback((evento: ReactKeyboardEvent<HTMLDivElement>) => {
        if (evento.key === 'ArrowLeft' || evento.key === 'ArrowDown') { onChange(Math.max(min, valor - 1)); evento.preventDefault(); }
        if (evento.key === 'ArrowRight' || evento.key === 'ArrowUp') { onChange(Math.min(max, valor + 1)); evento.preventDefault(); }
    }, [min, max, valor, onChange]);

    const amplitude = max - min;
    const posThumb = amplitude === 0 ? 0 : ((valor - min) / amplitude) * 100;
    const posNeutro = bipolar ? 50 : 0;
    const inicioPreenchimento = Math.min(posNeutro, posThumb);
    const larguraPreenchimento = Math.abs(posThumb - posNeutro);

    return (
        <div ref={trilhaRef} className={styles.trilha} onPointerDown={aoPressionar} onPointerMove={aoMover} onKeyDown={aoTeclar} role="slider" tabIndex={0} aria-valuemin={min} aria-valuemax={max} aria-valuenow={valor}>
            {bipolar ? <span className={styles.centro} /> : null}
            <span className={styles.preenchimento} style={{ left: `${inicioPreenchimento}%`, width: `${larguraPreenchimento}%` }} />
            <span className={styles.thumb} style={{ left: `${posThumb}%` }} />
        </div>
    );
};
