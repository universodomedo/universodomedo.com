'use client';

import styles from './styles.module.css';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type TouchEvent, type WheelEvent } from 'react';
import type { CatalogoMissaoJogavelResumo, MissaoJogavelResumo } from 'types-nora-api';

type CatalogoDeMissoesProps = {
    readonly catalogos: readonly CatalogoMissaoJogavelResumo[];
    readonly idMissaoSelecionada: number | null;
    readonly carregando: boolean;
    readonly aoSelecionarMissao: (missao: MissaoJogavelResumo) => void;
};

type ItemCatalogoOrbital = {
    readonly tipo: 'catalogo';
    readonly id: string;
    readonly idCatalogo: number;
    readonly catalogo: CatalogoMissaoJogavelResumo;
};

type ItemMissaoOrbital = {
    readonly tipo: 'missao';
    readonly id: string;
    readonly idCatalogo: number;
    readonly catalogo: CatalogoMissaoJogavelResumo;
    readonly missao: MissaoJogavelResumo;
};

type ItemOrbital = ItemCatalogoOrbital | ItemMissaoOrbital;

type Tamanho = { readonly largura: number; readonly altura: number };

type CatalogoFixado = {
    readonly nome: string;
    readonly estilo: CSSProperties;
};

type LayoutOrbital = {
    readonly estilos: readonly CSSProperties[];
    readonly orbita: CSSProperties | null;
    readonly catalogoFixado: CatalogoFixado | null;
};

const RAZAO_RAIO_ALTURA = 0.62;
const RAZAO_APICE = 0.94;
const RAZAO_FOLGA_ARCO = 0.018;
const RAZAO_LARGURA_MISSAO = 0.27;
const RAZAO_LARGURA_SELECIONADA = 0.44;
const RAZAO_ALTURA_HEADER = 0.05;
const RAZAO_ALTURA_MISSAO = 0.075;
const RAZAO_ALTURA_SELECIONADA = 0.097;
const RAZAO_ESPACO_ITENS = 0.018;
const RAZAO_FONTE_HEADER = 0.019;
const RAZAO_FONTE_MISSAO = 0.0185;
const RAZAO_FONTE_SELECIONADA = 0.032;
const RAZAO_QUEDA_OPACIDADE = 0.5;
const RAZAO_TOPO_FIXADO = 0.02;
const LIMIAR_TOQUE = 36;

const ESTILO_OCULTO: CSSProperties = { opacity: 0, pointerEvents: 'none' };

export default function CatalogoDeMissoes({ catalogos, idMissaoSelecionada, carregando, aoSelecionarMissao }: CatalogoDeMissoesProps) {
    const secaoRef = useRef<HTMLElement | null>(null);
    const inicioToqueY = useRef<number | null>(null);
    const [tamanho, setTamanho] = useState<Tamanho>({ largura: 0, altura: 0 });
    const [idsCatalogosFechados, setIdsCatalogosFechados] = useState<readonly number[]>([]);
    const catalogosComMissoes = useMemo(() => catalogos.filter(catalogo => catalogo.missoes.length > 0), [catalogos]);
    const itensOrbitais = useMemo(() => montaItensOrbitais(catalogosComMissoes, idsCatalogosFechados), [catalogosComMissoes, idsCatalogosFechados]);
    const missoesVisiveis = useMemo(() => itensOrbitais.filter(itemOrbitalEhMissao), [itensOrbitais]);
    const indiceSelecionado = resolveIndiceSelecionado(itensOrbitais, idMissaoSelecionada);
    const layout = useMemo(() => montaLayoutOrbital(itensOrbitais, indiceSelecionado, tamanho), [itensOrbitais, indiceSelecionado, tamanho]);
    const vazio = !carregando && catalogosComMissoes.length === 0;

    useLayoutEffect(() => {
        const elemento = secaoRef.current;
        if (!elemento) return;

        function medir(): void { if (elemento) setTamanho({ largura: elemento.clientWidth, altura: elemento.clientHeight }); };

        medir();
        const observador = new ResizeObserver(medir);
        observador.observe(elemento);
        return () => observador.disconnect();
    }, []);

    useEffect(() => {
        if (missoesVisiveis.length === 0) return;
        if (missoesVisiveis.some(item => item.missao.id === idMissaoSelecionada)) return;

        aoSelecionarMissao(missoesVisiveis[0].missao);
    }, [missoesVisiveis, idMissaoSelecionada, aoSelecionarMissao]);

    const alternarCatalogo = useCallback((idCatalogo: number) => {
        setIdsCatalogosFechados(idsAtuais => idsAtuais.includes(idCatalogo) ? idsAtuais.filter(id => id !== idCatalogo) : [...idsAtuais, idCatalogo]);
    }, []);

    const selecionarMissaoRelativa = useCallback((direcao: -1 | 1) => {
        if (missoesVisiveis.length === 0) return;

        const indiceAtual = missoesVisiveis.findIndex(item => item.missao.id === idMissaoSelecionada);
        const indiceBase = indiceAtual >= 0 ? indiceAtual : 0;
        const proximoIndice = (indiceBase + direcao + missoesVisiveis.length) % missoesVisiveis.length;

        aoSelecionarMissao(missoesVisiveis[proximoIndice].missao);
    }, [missoesVisiveis, idMissaoSelecionada, aoSelecionarMissao]);

    function onWheel(evento: WheelEvent<HTMLElement>): void {
        if (missoesVisiveis.length <= 1) return;

        evento.preventDefault();
        selecionarMissaoRelativa(evento.deltaY > 0 ? 1 : -1);
    };

    function onTouchStart(evento: TouchEvent<HTMLElement>): void {
        const toque = evento.touches.item(0);
        inicioToqueY.current = toque ? toque.clientY : null;
    };

    function onTouchEnd(evento: TouchEvent<HTMLElement>): void {
        const inicioY = inicioToqueY.current;
        const toque = evento.changedTouches.item(0);
        inicioToqueY.current = null;

        if (inicioY === null || !toque || missoesVisiveis.length <= 1) return;

        const deslocamento = toque.clientY - inicioY;
        if (Math.abs(deslocamento) < LIMIAR_TOQUE) return;

        selecionarMissaoRelativa(deslocamento < 0 ? 1 : -1);
    };

    return (
        <section ref={secaoRef} className={`${styles.catalogo_de_missoes} ${carregando || vazio ? styles.catalogo_de_missoes_vazio : ''}`} aria-label="Catálogo de Missões" onWheel={onWheel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {carregando && (
                <div className={styles.estado_catalogo}>
                    <strong>Carregando missões</strong>
                    <span>Aguarde um instante.</span>
                </div>
            )}
            {vazio && (
                <div className={styles.estado_catalogo}>
                    <strong>Não há missões disponíveis</strong>
                    <span>Volte em breve para novos desafios solo.</span>
                </div>
            )}
            {!carregando && !vazio && (
                <>
                    {layout.orbita && <div className={styles.orbita} style={layout.orbita} aria-hidden="true" />}
                    <div className={styles.lista_catalogos}>
                        {itensOrbitais.map((item, indice) => <ItemOrbital key={item.id} item={item} estilo={layout.estilos[indice]} idMissaoSelecionada={idMissaoSelecionada} idsCatalogosFechados={idsCatalogosFechados} aoSelecionarMissao={aoSelecionarMissao} aoAlternarCatalogo={alternarCatalogo} />)}
                    </div>
                    {layout.catalogoFixado && (
                        <div className={styles.catalogo_fixado} style={layout.catalogoFixado.estilo} aria-hidden="true">
                            <strong>{layout.catalogoFixado.nome}</strong>
                            <span className={styles.linha_catalogo} />
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

function ItemOrbital({ item, estilo, idMissaoSelecionada, idsCatalogosFechados, aoSelecionarMissao, aoAlternarCatalogo }: { readonly item: ItemOrbital; readonly estilo: CSSProperties; readonly idMissaoSelecionada: number | null; readonly idsCatalogosFechados: readonly number[]; readonly aoSelecionarMissao: (missao: MissaoJogavelResumo) => void; readonly aoAlternarCatalogo: (idCatalogo: number) => void; }) {
    if (item.tipo === 'catalogo') {
        const fechado = idsCatalogosFechados.includes(item.idCatalogo);

        return (
            <button type="button" className={`${styles.item_orbital} ${styles.item_catalogo} ${fechado ? styles.item_catalogo_fechado : ''}`} style={estilo} onClick={() => aoAlternarCatalogo(item.idCatalogo)} aria-expanded={!fechado}>
                <strong>{item.catalogo.nome}</strong>
                <span className={styles.linha_catalogo} aria-hidden="true" />
            </button>
        );
    }

    const selecionada = item.missao.id === idMissaoSelecionada;

    return (
        <button type="button" className={`${styles.item_orbital} ${styles.item_missao} ${selecionada ? styles.item_missao_selecionada : ''}`} style={estilo} onClick={() => aoSelecionarMissao(item.missao)}>
            <strong>{item.missao.nome}</strong>
        </button>
    );
};

function montaItensOrbitais(catalogos: readonly CatalogoMissaoJogavelResumo[], idsCatalogosFechados: readonly number[]): readonly ItemOrbital[] {
    const itens: ItemOrbital[] = [];

    catalogos.forEach(catalogo => {
        itens.push({ tipo: 'catalogo', id: `catalogo-${catalogo.id}`, idCatalogo: catalogo.id, catalogo });

        if (!idsCatalogosFechados.includes(catalogo.id)) {
            catalogo.missoes.forEach(missao => {
                itens.push({ tipo: 'missao', id: `missao-${missao.id}`, idCatalogo: catalogo.id, catalogo, missao });
            });
        }
    });

    return itens;
};

function itemOrbitalEhMissao(item: ItemOrbital): item is ItemMissaoOrbital { return item.tipo === 'missao'; };

function resolveIndiceSelecionado(itens: readonly ItemOrbital[], idMissaoSelecionada: number | null): number {
    const indiceMissaoSelecionada = itens.findIndex(item => item.tipo === 'missao' && item.missao.id === idMissaoSelecionada);
    if (indiceMissaoSelecionada >= 0) return indiceMissaoSelecionada;

    const indicePrimeiraMissao = itens.findIndex(itemOrbitalEhMissao);
    return indicePrimeiraMissao >= 0 ? indicePrimeiraMissao : 0;
};

function alturaDoItem(item: ItemOrbital, selecionado: boolean, largura: number): number {
    if (item.tipo === 'catalogo') return largura * RAZAO_ALTURA_HEADER;
    return largura * (selecionado ? RAZAO_ALTURA_SELECIONADA : RAZAO_ALTURA_MISSAO);
};

function fonteDoItem(item: ItemOrbital, selecionado: boolean, largura: number): number {
    if (item.tipo === 'catalogo') return largura * RAZAO_FONTE_HEADER;
    return largura * (selecionado ? RAZAO_FONTE_SELECIONADA : RAZAO_FONTE_MISSAO);
};

function montaCentrosVerticais(alturas: readonly number[], indiceSelecionado: number, centroVertical: number, espaco: number): readonly number[] {
    const centros = new Array<number>(alturas.length);
    centros[indiceSelecionado] = centroVertical;

    for (let i = indiceSelecionado - 1; i >= 0; i--) centros[i] = centros[i + 1] - (alturas[i + 1] / 2 + espaco + alturas[i] / 2);
    for (let i = indiceSelecionado + 1; i < alturas.length; i++) centros[i] = centros[i - 1] + (alturas[i - 1] / 2 + espaco + alturas[i] / 2);

    return centros;
};

function encontraIndiceCatalogoAtual(itens: readonly ItemOrbital[], indiceSelecionado: number): number {
    for (let i = indiceSelecionado; i >= 0; i--) {
        if (itens[i].tipo === 'catalogo') return i;
    }

    return -1;
};

function montaLayoutOrbital(itens: readonly ItemOrbital[], indiceSelecionado: number, tamanho: Tamanho): LayoutOrbital {
    const { largura, altura } = tamanho;
    if (largura <= 0 || altura <= 0 || itens.length === 0) return { estilos: itens.map(() => ESTILO_OCULTO), orbita: null, catalogoFixado: null };

    const raio = altura * RAZAO_RAIO_ALTURA;
    const apice = largura * RAZAO_APICE;
    const centroHorizontal = apice - raio;
    const folga = largura * RAZAO_FOLGA_ARCO;
    const centroVertical = altura / 2;
    const espaco = largura * RAZAO_ESPACO_ITENS;
    const quedaOpacidade = altura * RAZAO_QUEDA_OPACIDADE;

    const alturas = itens.map((item, indice) => alturaDoItem(item, indice === indiceSelecionado, largura));
    const fontes = itens.map((item, indice) => fonteDoItem(item, indice === indiceSelecionado, largura));
    const centros = montaCentrosVerticais(alturas, indiceSelecionado, centroVertical, espaco);

    const indiceCatalogoAtual = encontraIndiceCatalogoAtual(itens, indiceSelecionado);
    const topoHeaderAtual = indiceCatalogoAtual >= 0 ? centros[indiceCatalogoAtual] - alturas[indiceCatalogoAtual] / 2 : Number.POSITIVE_INFINITY;
    const fixarCatalogo = indiceCatalogoAtual >= 0 && topoHeaderAtual < raio * 0.01;

    const estilos = itens.map((item, indice) => {
        if (fixarCatalogo && indice === indiceCatalogoAtual) return ESTILO_OCULTO;

        const deslocamentoVertical = centros[indice] - centroVertical;
        if (Math.abs(deslocamentoVertical) >= raio) return ESTILO_OCULTO;

        const arcoDireita = centroHorizontal + Math.sqrt(raio * raio - deslocamentoVertical * deslocamentoVertical);
        const selecionado = indice === indiceSelecionado && item.tipo === 'missao';
        const distancia = Math.abs(indice - indiceSelecionado);

        const estilo: CSSProperties = {
            top: `${centros[indice] - alturas[indice] / 2}px`,
            right: `${largura - arcoDireita + folga}px`,
            height: `${alturas[indice]}px`,
            fontSize: `${fontes[indice]}px`,
            opacity: selecionado ? 1 : Math.max(0.38, 1 - Math.abs(deslocamentoVertical) / quedaOpacidade),
            zIndex: selecionado ? 50 : Math.max(0, 20 - distancia),
        };
        if (item.tipo === 'missao') estilo.width = `${largura * (selecionado ? RAZAO_LARGURA_SELECIONADA : RAZAO_LARGURA_MISSAO)}px`;

        return estilo;
    });

    const orbita: CSSProperties = { left: `${centroHorizontal - raio}px`, top: `${centroVertical - raio}px`, width: `${raio * 2}px`, height: `${raio * 2}px` };
    const catalogoFixado = fixarCatalogo ? montaCatalogoFixado((itens[indiceCatalogoAtual] as ItemCatalogoOrbital).catalogo.nome, raio, centroHorizontal, centroVertical, folga, largura) : null;

    return { estilos, orbita, catalogoFixado };
};

function montaCatalogoFixado(nome: string, raio: number, centroHorizontal: number, centroVertical: number, folga: number, largura: number): CatalogoFixado {
    const topoFixado = largura * RAZAO_TOPO_FIXADO;
    const deslocamentoVertical = topoFixado + largura * RAZAO_ALTURA_HEADER / 2 - centroVertical;
    const arcoDireita = centroHorizontal + Math.sqrt(Math.max(0, raio * raio - deslocamentoVertical * deslocamentoVertical));

    return { nome, estilo: { top: `${topoFixado}px`, right: `${largura - arcoDireita + folga}px`, fontSize: `${largura * RAZAO_FONTE_HEADER}px` } };
};
