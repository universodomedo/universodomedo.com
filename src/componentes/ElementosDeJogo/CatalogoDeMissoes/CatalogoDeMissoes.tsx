'use client';

import styles from './styles.module.css';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type TouchEvent, type WheelEvent } from 'react';

export type MissaoCatalogoDeMissoes = {
    readonly id: number;
    readonly nome: string;
    readonly descricao: string;
};

export type CatalogoDeMissoesItem = {
    readonly id: number;
    readonly nome: string;
    readonly missoes: readonly MissaoCatalogoDeMissoes[];
};

type CatalogoDeMissoesProps = {
    readonly catalogos: readonly CatalogoDeMissoesItem[];
    readonly idMissaoSelecionada: number | null;
    readonly carregando: boolean;
    readonly aoSelecionarMissao: (missao: MissaoCatalogoDeMissoes) => void;
};

type ItemCatalogoOrbital = {
    readonly tipo: 'catalogo';
    readonly id: string;
    readonly idCatalogo: number;
    readonly catalogo: CatalogoDeMissoesItem;
};

type ItemMissaoOrbital = {
    readonly tipo: 'missao';
    readonly id: string;
    readonly idCatalogo: number;
    readonly catalogo: CatalogoDeMissoesItem;
    readonly missao: MissaoCatalogoDeMissoes;
};

type ItemOrbital = ItemCatalogoOrbital | ItemMissaoOrbital;

type EstiloOrbital = CSSProperties & {
    readonly '--orbita-externa-left': string;
    readonly '--orbita-externa-top': string;
    readonly '--orbita-externa-width': string;
    readonly '--orbita-externa-height': string;
};

type EstiloItemOrbital = CSSProperties & {
    readonly '--orbital-x': string;
    readonly '--orbital-y': string;
    readonly '--orbital-scale': string;
    readonly '--orbital-opacity': string;
    readonly '--orbital-z': number;
};

type GeometriaOrbital = {
    readonly centroX: number;
    readonly centroY: number;
    readonly raioX: number;
    readonly raioY: number;
    readonly profundidadeItens: number;
};

const GEOMETRIA_ORBITAL: GeometriaOrbital = {
    centroX: 100,
    centroY: 50,
    raioX: 94,
    raioY: 70,
    profundidadeItens: 3.4,
};

const ANGULO_CENTRAL_GRAUS = 180;
const ANGULO_ENTRE_ITENS_GRAUS = 8;
const LIMITE_DESLOCAMENTO_ORBITAL = 6;
const LIMIAR_TOQUE = 36;

export default function CatalogoDeMissoes({ catalogos, idMissaoSelecionada, carregando, aoSelecionarMissao }: CatalogoDeMissoesProps) {
    const [idsCatalogosFechados, setIdsCatalogosFechados] = useState<readonly number[]>([]);
    const inicioToqueY = useRef<number | null>(null);
    const catalogosComMissoes = useMemo(() => catalogos.filter(catalogo => catalogo.missoes.length > 0), [catalogos]);
    const itensOrbitais = useMemo(() => montaItensOrbitais(catalogosComMissoes, idsCatalogosFechados), [catalogosComMissoes, idsCatalogosFechados]);
    const missoesVisiveis = useMemo(() => itensOrbitais.filter(itemOrbitalEhMissao), [itensOrbitais]);
    const indiceSelecionado = resolveIndiceSelecionado(itensOrbitais, idMissaoSelecionada);
    const estiloOrbital = montaEstiloOrbital(GEOMETRIA_ORBITAL);

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

    if (carregando) {
        return (
            <section className={`${styles.catalogo_de_missoes} ${styles.catalogo_de_missoes_vazio}`}>
                <div className={styles.estado_catalogo}>
                    <strong>Carregando missões</strong>
                    <span>Aguarde um instante.</span>
                </div>
            </section>
        );
    }

    if (catalogosComMissoes.length === 0) {
        return (
            <section className={`${styles.catalogo_de_missoes} ${styles.catalogo_de_missoes_vazio}`}>
                <div className={styles.estado_catalogo}>
                    <strong>Não há missões disponíveis</strong>
                    <span>Volte em breve para novos desafios solo.</span>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.catalogo_de_missoes} style={estiloOrbital} aria-label="Catálogo de Missões" onWheel={onWheel} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className={styles.lista_catalogos}>
                {itensOrbitais.map((item, indice) => <ItemOrbital key={item.id} item={item} indice={indice} indiceSelecionado={indiceSelecionado} idMissaoSelecionada={idMissaoSelecionada} idsCatalogosFechados={idsCatalogosFechados} aoSelecionarMissao={aoSelecionarMissao} aoAlternarCatalogo={alternarCatalogo} />)}
            </div>
        </section>
    );
};

function ItemOrbital({ item, indice, indiceSelecionado, idMissaoSelecionada, idsCatalogosFechados, aoSelecionarMissao, aoAlternarCatalogo }: { readonly item: ItemOrbital; readonly indice: number; readonly indiceSelecionado: number; readonly idMissaoSelecionada: number | null; readonly idsCatalogosFechados: readonly number[]; readonly aoSelecionarMissao: (missao: MissaoCatalogoDeMissoes) => void; readonly aoAlternarCatalogo: (idCatalogo: number) => void; }) {
    const distancia = indice - indiceSelecionado;
    const estilo = montaEstiloItemOrbital(distancia, item.tipo);

    if (item.tipo === 'catalogo') {
        const fechado = idsCatalogosFechados.includes(item.idCatalogo);

        return (
            <button type="button" className={`${styles.item_orbital} ${styles.item_catalogo} ${fechado ? styles.item_catalogo_fechado : ''}`} style={estilo} onClick={() => aoAlternarCatalogo(item.idCatalogo)} aria-expanded={!fechado}>
                <span className={styles.marcador_catalogo} aria-hidden="true" />
                <strong>{item.catalogo.nome}</strong>
            </button>
        );
    }

    const selecionada = item.missao.id === idMissaoSelecionada;

    return (
        <button type="button" className={`${styles.item_orbital} ${styles.item_missao} ${selecionada ? styles.item_missao_selecionada : ''}`} style={estilo} onClick={() => aoSelecionarMissao(item.missao)}>
            <span className={styles.icone_missao} aria-hidden="true" />
            <span className={styles.textos_missao}>
                <strong>{item.missao.nome}</strong>
                <span>{item.missao.descricao}</span>
            </span>
        </button>
    );
};

function montaItensOrbitais(catalogos: readonly CatalogoDeMissoesItem[], idsCatalogosFechados: readonly number[]): readonly ItemOrbital[] {
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

function montaEstiloOrbital(geometria: GeometriaOrbital): EstiloOrbital {
    return {
        '--orbita-externa-left': `${geometria.centroX - geometria.raioX}%`,
        '--orbita-externa-top': `${geometria.centroY - geometria.raioY}%`,
        '--orbita-externa-width': `${geometria.raioX * 2}%`,
        '--orbita-externa-height': `${geometria.raioY * 2}%`,
    };
};

function montaEstiloItemOrbital(distancia: number, tipo: ItemOrbital['tipo']): EstiloItemOrbital {
    const distanciaLimitada = Math.max(-LIMITE_DESLOCAMENTO_ORBITAL, Math.min(LIMITE_DESLOCAMENTO_ORBITAL, distancia));
    const angulo = ANGULO_CENTRAL_GRAUS - distanciaLimitada * ANGULO_ENTRE_ITENS_GRAUS;
    const radianos = angulo * Math.PI / 180;
    const x = GEOMETRIA_ORBITAL.centroX + Math.cos(radianos) * GEOMETRIA_ORBITAL.raioX + GEOMETRIA_ORBITAL.profundidadeItens;
    const y = GEOMETRIA_ORBITAL.centroY + Math.sin(radianos) * GEOMETRIA_ORBITAL.raioY;
    const distanciaAbsoluta = Math.abs(distancia);
    const escalaBase = Math.max(0.72, 1 - distanciaAbsoluta * 0.07);
    const escala = tipo === 'catalogo' ? escalaBase * 0.92 : escalaBase;
    const opacidade = Math.max(0.34, 1 - distanciaAbsoluta * 0.14);

    return {
        '--orbital-x': `${x}%`,
        '--orbital-y': `${y}%`,
        '--orbital-scale': escala.toFixed(3),
        '--orbital-opacity': opacidade.toFixed(3),
        '--orbital-z': 100 - distanciaAbsoluta,
    };
};
