'use client';

import styles from './styles.module.css';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type TouchEvent, type WheelEvent } from 'react';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { ItemPartidaOrbital } from 'Componentes/ElementosDeJogo/ItemPartidaOrbital/ItemPartidaOrbital';
import { useImagemCapaArte } from 'Funcionalidades/ArteDeCapa/useImagemCapaArte';
import type { ArteCapaDaPartida } from 'types-nora-api';

export type CatalogoDeMissoesItem = { readonly id: number; readonly nome: string; readonly arteCapa?: ArteCapaDaPartida | null; readonly bloqueado?: boolean; };

export type CatalogoDeMissoesSubgrupo = { readonly id: string; readonly rotulo: string; readonly itens: readonly CatalogoDeMissoesItem[]; readonly mensagemVazio: string; readonly slotUnico: boolean; };

export type CatalogoDeMissoesCatalogo = { readonly id: number; readonly nome: string; readonly missoes: readonly CatalogoDeMissoesItem[]; readonly subgrupos?: readonly CatalogoDeMissoesSubgrupo[]; };

type CatalogoDeMissoesProps = {
    readonly catalogos: readonly CatalogoDeMissoesCatalogo[];
    readonly carregando: boolean;
    readonly aoFocarMissao: (missao: CatalogoDeMissoesItem | null) => void;
    // Missão (Partida) a centralizar ao montar. null/não achada = padrão (primeira missão).
    readonly idMissaoInicial?: number | null;
};

type ItemCatalogoOrbital = {
    readonly tipo: 'catalogo';
    readonly id: string;
    readonly keyColapso: string;
    readonly catalogo: CatalogoDeMissoesCatalogo;
};

type ItemSubgrupoOrbital = {
    readonly tipo: 'subgrupo';
    readonly id: string;
    readonly keyColapso: string;
    readonly rotulo: string;
};

type ItemSubgrupoUnicoOrbital = {
    readonly tipo: 'subgrupo_unico';
    readonly id: string;
    readonly rotulo: string;
    readonly missao: CatalogoDeMissoesItem | null;
    readonly mensagemVazio: string;
};

type ItemMissaoOrbital = {
    readonly tipo: 'missao';
    readonly id: string;
    readonly idCatalogo: number;
    readonly catalogo: CatalogoDeMissoesCatalogo;
    readonly missao: CatalogoDeMissoesItem;
};

type ItemVazioOrbital = {
    readonly tipo: 'vazio';
    readonly id: string;
    readonly idCatalogo: number;
    readonly rotulo: string;
    readonly mensagem: string;
};

type ItemOrbital = ItemCatalogoOrbital | ItemSubgrupoOrbital | ItemSubgrupoUnicoOrbital | ItemMissaoOrbital | ItemVazioOrbital;

type Tamanho = { readonly largura: number; readonly altura: number };

type CatalogoFixado = {
    readonly nome: string;
    readonly estilo: CSSProperties;
};

type ItemRenderizado = {
    readonly chave: string;
    readonly vAbsoluto: number;
    readonly item: ItemOrbital;
    readonly estilo: CSSProperties;
    readonly ehCentral: boolean;
};

type CabecalhoAtual = { readonly offset: number; readonly centro: number; readonly nome: string };

type LayoutOrbital = {
    readonly itens: readonly ItemRenderizado[];
    readonly orbita: CSSProperties | null;
    readonly catalogoFixado: CatalogoFixado | null;
};

const RAZAO_RAIO_ALTURA = 0.62;
const RAZAO_APICE = 0.94;
const RAZAO_FOLGA_ARCO = 0.018;
const RAZAO_LARGURA_MISSAO = 0.27;
const RAZAO_LARGURA_SELECIONADA = 0.44;
const RAZAO_ALTURA_HEADER = 0.05;
const RAZAO_ALTURA_SUBGRUPO = 0.042;
const RAZAO_ALTURA_VAZIO = 0.05;
const RAZAO_ALTURA_MISSAO = 0.075;
const RAZAO_ALTURA_SELECIONADA = 0.097;
const RAZAO_ESPACO_ITENS = 0.018;
const RAZAO_VAO_ALVO = 0.8;
const RAZAO_FONTE_HEADER = 0.019;
const RAZAO_FONTE_SUBGRUPO = 0.016;
const RAZAO_FONTE_VAZIO = 0.0155;
const RAZAO_FONTE_MISSAO = 0.0185;
const RAZAO_FONTE_SELECIONADA = 0.032;
const RAZAO_QUEDA_OPACIDADE = 0.5;
const RAZAO_TOPO_FIXADO = 0.02;
const LIMIAR_TOQUE = 36;

function mod(valor: number, divisor: number): number { return ((valor % divisor) + divisor) % divisor; };

export default function CatalogoDeMissoes({ catalogos, carregando, aoFocarMissao, idMissaoInicial }: CatalogoDeMissoesProps) {
    const secaoRef = useRef<HTMLElement | null>(null);
    const inicioToqueY = useRef<number | null>(null);
    const inicializadoRef = useRef(false);
    const [tamanho, setTamanho] = useState<Tamanho>({ largura: 0, altura: 0 });
    const [vCentro, setVCentro] = useState(0);
    const [chavesColapsadas, setChavesColapsadas] = useState<readonly string[]>([]);
    const catalogosComItens = useMemo(() => catalogos.filter(catalogo => catalogo.missoes.length > 0 || (catalogo.subgrupos?.length ?? 0) > 0), [catalogos]);
    const itensOrbitais = useMemo(() => montaItensOrbitais(catalogosComItens, chavesColapsadas), [catalogosComItens, chavesColapsadas]);
    const itensNavegaveis = useMemo(() => itensOrbitais.filter(itemEhNavegavel), [itensOrbitais]);
    const total = itensOrbitais.length;
    const itemCentral = total > 0 ? itensOrbitais[mod(vCentro, total)] : undefined;
    const layout = useMemo(() => montaLayoutOrbital(itensOrbitais, vCentro, tamanho), [itensOrbitais, vCentro, tamanho]);
    const vazio = !carregando && catalogosComItens.length === 0;

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
        if (inicializadoRef.current || total === 0) return;

        // Prioriza a Partida salva (última selecionada); senão, a primeira missão (padrão).
        const indiceSalvo = idMissaoInicial != null ? itensOrbitais.findIndex(item => missaoFocadaDoItem(item)?.id === idMissaoInicial) : -1;
        const indiceMissao = indiceSalvo >= 0 ? indiceSalvo : itensOrbitais.findIndex(item => missaoFocadaDoItem(item) !== null);
        const alvo = indiceMissao >= 0 ? indiceMissao : itensOrbitais.findIndex(itemEhNavegavel);
        if (alvo >= 0) {
            setVCentro(alvo);
            inicializadoRef.current = true;
        }
    }, [itensOrbitais, total, idMissaoInicial]);

    useEffect(() => {
        if (total === 0 || !itemCentral || itemEhNavegavel(itemCentral)) return;

        const indice = itensOrbitais.findIndex(itemEhNavegavel);
        if (indice >= 0) setVCentro(v => v - mod(v, total) + indice);
    }, [itemCentral, itensOrbitais, total]);

    useEffect(() => {
        aoFocarMissao(missaoFocadaDoItem(itemCentral));
    }, [itemCentral, aoFocarMissao]);

    const centralizarItem = useCallback((vAbsoluto: number) => {
        setVCentro(vAbsoluto);
    }, []);

    const alternarColapso = useCallback((keyColapso: string, idItem: string) => {
        const jaColapsado = chavesColapsadas.includes(keyColapso);
        const novas = jaColapsado ? chavesColapsadas.filter(chave => chave !== keyColapso) : [...chavesColapsadas, keyColapso];
        const novaLista = montaItensOrbitais(catalogosComItens, novas);
        const novoIndice = novaLista.findIndex(it => it.id === idItem);
        setChavesColapsadas(novas);
        if (novoIndice >= 0 && novaLista.length > 0) setVCentro(v => v - mod(v, novaLista.length) + novoIndice);
    }, [chavesColapsadas, catalogosComItens]);

    const navegarRelativo = useCallback((direcao: -1 | 1) => {
        if (total === 0) return;

        let v = vCentro + direcao;
        for (let passos = 0; passos < total; passos++) {
            if (itemEhNavegavel(itensOrbitais[mod(v, total)])) break;
            v += direcao;
        }

        const alvo = itensOrbitais[mod(v, total)];
        if (!itemEhNavegavel(alvo)) return;

        centralizarItem(v);
    }, [vCentro, itensOrbitais, total, centralizarItem]);

    function onWheel(evento: WheelEvent<HTMLElement>): void {
        if (itensNavegaveis.length <= 1) return;

        evento.preventDefault();
        navegarRelativo(evento.deltaY > 0 ? 1 : -1);
    };

    function onTouchStart(evento: TouchEvent<HTMLElement>): void {
        const toque = evento.touches.item(0);
        inicioToqueY.current = toque ? toque.clientY : null;
    };

    function onTouchEnd(evento: TouchEvent<HTMLElement>): void {
        const inicioY = inicioToqueY.current;
        const toque = evento.changedTouches.item(0);
        inicioToqueY.current = null;

        if (inicioY === null || !toque || itensNavegaveis.length <= 1) return;

        const deslocamento = toque.clientY - inicioY;
        if (Math.abs(deslocamento) < LIMIAR_TOQUE) return;

        navegarRelativo(deslocamento < 0 ? 1 : -1);
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
                        {layout.itens.map(descritor => <ItemOrbital key={descritor.chave} item={descritor.item} estilo={descritor.estilo} ehCentral={descritor.ehCentral} colapsado={estaColapsado(descritor.item, chavesColapsadas)} vAbsoluto={descritor.vAbsoluto} aoCentralizar={centralizarItem} aoAlternarColapso={alternarColapso} />)}
                    </div>
                    {layout.catalogoFixado && (
                        <div className={styles.catalogo_fixado} style={layout.catalogoFixado.estilo} aria-hidden="true">
                            <strong>{layout.catalogoFixado.nome}</strong>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

function ItemOrbital({ item, estilo, ehCentral, colapsado, vAbsoluto, aoCentralizar, aoAlternarColapso }: { readonly item: ItemOrbital; readonly estilo: CSSProperties; readonly ehCentral: boolean; readonly colapsado: boolean; readonly vAbsoluto: number; readonly aoCentralizar: (vAbsoluto: number) => void; readonly aoAlternarColapso: (keyColapso: string, idItem: string) => void; }) {
    if (item.tipo === 'catalogo') {
        return (
            <DivClicavel className={`${styles.item_orbital} ${styles.item_catalogo} ${ehCentral ? styles.item_catalogo_central : ''}`} style={estilo} onClick={() => aoCentralizar(vAbsoluto)} role="button" title="Navegar até o Catálogo">
                <strong>{item.catalogo.nome}</strong>
                <button type="button" className={styles.item_catalogo_toggle} onClick={evento => { evento.stopPropagation(); aoAlternarColapso(item.keyColapso, item.id); }} aria-expanded={!colapsado} title={colapsado ? 'Expandir Catálogo' : 'Retrair Catálogo'}>
                    <svg viewBox="0 0 12 12" className={`${styles.item_catalogo_chevron} ${colapsado ? styles.item_catalogo_chevron_colapsado : ''}`} aria-hidden="true">
                        <path d="M2.5 4.5L6 8L9.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </DivClicavel>
        );
    }

    if (item.tipo === 'subgrupo') {
        return (
            <DivClicavel className={`${styles.item_orbital} ${styles.item_subgrupo} ${ehCentral ? styles.item_subgrupo_central : ''}`} style={estilo} onClick={() => aoCentralizar(vAbsoluto)} role="button" title="Navegar até o SubCatálogo">
                <strong>{item.rotulo}</strong>
                <button type="button" className={styles.item_catalogo_toggle} onClick={evento => { evento.stopPropagation(); aoAlternarColapso(item.keyColapso, item.id); }} aria-expanded={!colapsado} title={colapsado ? 'Expandir SubCatálogo' : 'Retrair SubCatálogo'}>
                    <svg viewBox="0 0 12 12" className={`${styles.item_catalogo_chevron} ${colapsado ? styles.item_catalogo_chevron_colapsado : ''}`} aria-hidden="true">
                        <path d="M2.5 4.5L6 8L9.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </DivClicavel>
        );
    }

    if (item.tipo === 'subgrupo_unico') {
        if (item.missao === null) {
            return (
                <DivClicavel className={`${styles.item_orbital} ${styles.item_subgrupo_inativo} ${ehCentral ? styles.item_subgrupo_inativo_central : ''}`} style={estilo} onClick={() => aoCentralizar(vAbsoluto)} role="button" title="Sem Desafio ativo">
                    <strong>{item.rotulo}</strong>
                    <span>{item.mensagemVazio}</span>
                </DivClicavel>
            );
        }

        return (
            <DivClicavel className={`${styles.item_orbital} ${styles.item_subgrupo} ${styles.item_subgrupo_unico} ${ehCentral ? styles.item_subgrupo_central : ''}`} style={estilo} onClick={() => aoCentralizar(vAbsoluto)} role="button" title="Abrir Desafio">
                <strong>{item.rotulo}</strong>
            </DivClicavel>
        );
    }

    if (item.tipo === 'vazio') {
        return (
            <div className={`${styles.item_orbital} ${styles.item_vazio}`} style={estilo} aria-hidden="true">
                <strong>{item.rotulo}</strong>
                <span>{item.mensagem}</span>
            </div>
        );
    }

    return <ItemMissaoNoOrbital item={item} estilo={estilo} ehCentral={ehCentral} vAbsoluto={vAbsoluto} aoCentralizar={aoCentralizar} />;
};

function ItemMissaoNoOrbital({ item, estilo, ehCentral, vAbsoluto, aoCentralizar }: { readonly item: ItemMissaoOrbital; readonly estilo: CSSProperties; readonly ehCentral: boolean; readonly vAbsoluto: number; readonly aoCentralizar: (vAbsoluto: number) => void; }) {
    const imagem = useImagemCapaArte(item.missao.arteCapa?.idProjeto ?? null);

    return <ItemPartidaOrbital className={styles.item_missao_orbital} style={estilo} nome={item.missao.nome} imagemBase64={imagem} encaixe={item.missao.arteCapa?.encaixe ?? null} selecionado={ehCentral} bloqueado={item.missao.bloqueado === true} onClick={() => aoCentralizar(vAbsoluto)} />;
};

function montaItensOrbitais(catalogos: readonly CatalogoDeMissoesCatalogo[], chavesColapsadas: readonly string[]): readonly ItemOrbital[] {
    const itens: ItemOrbital[] = [];

    catalogos.forEach(catalogo => {
        const keyColapsoCatalogo = `catalogo:${catalogo.id}`;
        itens.push({ tipo: 'catalogo', id: `catalogo-${catalogo.id}`, keyColapso: keyColapsoCatalogo, catalogo });

        if (chavesColapsadas.includes(keyColapsoCatalogo)) return;

        // Missões soltas (sem subgrupo) ficam direto sob o header do catálogo, ANTES dos subgrupos.
        catalogo.missoes.forEach(missao => itens.push({ tipo: 'missao', id: `missao-${catalogo.id}-${missao.id}`, idCatalogo: catalogo.id, catalogo, missao }));

        if (catalogo.subgrupos && catalogo.subgrupos.length > 0) {
            catalogo.subgrupos.forEach(subgrupo => {
                // SubCatálogo de slot único (Diário/Semanal/Mensal): não colapsa e é SEMPRE selecionável, com ou sem item. Com item, focar abre o Detalhe; sem item, mostra "não está ativo" mas segue selecionável.
                if (subgrupo.slotUnico) {
                    itens.push({ tipo: 'subgrupo_unico', id: `subgrupo-unico-${catalogo.id}-${subgrupo.id}`, rotulo: subgrupo.rotulo, missao: subgrupo.itens[0] ?? null, mensagemVazio: subgrupo.mensagemVazio });
                    return;
                }

                if (subgrupo.itens.length === 0) {
                    itens.push({ tipo: 'vazio', id: `vazio-${catalogo.id}-${subgrupo.id}`, idCatalogo: catalogo.id, rotulo: subgrupo.rotulo, mensagem: subgrupo.mensagemVazio });
                    return;
                }

                // SubCatálogo de itens corridos (Especiais): colapsável e navegável, como um Catálogo.
                const keyColapsoSubgrupo = `subgrupo:${catalogo.id}:${subgrupo.id}`;
                itens.push({ tipo: 'subgrupo', id: `subgrupo-${catalogo.id}-${subgrupo.id}`, keyColapso: keyColapsoSubgrupo, rotulo: subgrupo.rotulo });
                if (chavesColapsadas.includes(keyColapsoSubgrupo)) return;
                subgrupo.itens.forEach(missao => itens.push({ tipo: 'missao', id: `missao-${catalogo.id}-${subgrupo.id}-${missao.id}`, idCatalogo: catalogo.id, catalogo, missao }));
            });
        }
    });

    return itens;
};

function itemEhNavegavel(item: ItemOrbital): boolean { return item.tipo === 'catalogo' || item.tipo === 'subgrupo' || item.tipo === 'subgrupo_unico' || item.tipo === 'missao'; };

function missaoFocadaDoItem(item: ItemOrbital | undefined): CatalogoDeMissoesItem | null {
    if (!item) return null;
    if (item.tipo === 'missao') return item.missao;
    if (item.tipo === 'subgrupo_unico') return item.missao;
    return null;
};

function estaColapsado(item: ItemOrbital, chavesColapsadas: readonly string[]): boolean { return (item.tipo === 'catalogo' || item.tipo === 'subgrupo') && chavesColapsadas.includes(item.keyColapso); };

function alturaDoItem(item: ItemOrbital, central: boolean, largura: number): number {
    if (item.tipo === 'catalogo') return largura * RAZAO_ALTURA_HEADER;
    if (item.tipo === 'subgrupo') return largura * RAZAO_ALTURA_SUBGRUPO;
    if (item.tipo === 'subgrupo_unico') return largura * (item.missao === null ? RAZAO_ALTURA_VAZIO : RAZAO_ALTURA_SUBGRUPO);
    if (item.tipo === 'vazio') return largura * RAZAO_ALTURA_VAZIO;
    return largura * (central ? RAZAO_ALTURA_SELECIONADA : RAZAO_ALTURA_MISSAO);
};

function fonteDoItem(item: ItemOrbital, central: boolean, largura: number): number {
    if (item.tipo === 'catalogo') return largura * RAZAO_FONTE_HEADER;
    if (item.tipo === 'subgrupo') return largura * RAZAO_FONTE_SUBGRUPO;
    if (item.tipo === 'subgrupo_unico') return largura * (item.missao === null ? RAZAO_FONTE_VAZIO : RAZAO_FONTE_SUBGRUPO);
    if (item.tipo === 'vazio') return largura * RAZAO_FONTE_VAZIO;
    return largura * (central ? RAZAO_FONTE_SELECIONADA : RAZAO_FONTE_MISSAO);
};

function encontraCabecalhoAtual(itens: readonly ItemOrbital[], vCentro: number, total: number, itemCentral: ItemOrbital, alturaCentral: number, centroVertical: number, espaco: number, largura: number): CabecalhoAtual | null {
    if (itemCentral.tipo === 'catalogo') return { offset: 0, centro: centroVertical, nome: itemCentral.catalogo.nome };

    let centro = centroVertical;
    let alturaAnterior = alturaCentral;
    for (let offset = -1; offset > -total - 1; offset--) {
        const item = itens[mod(vCentro + offset, total)];
        const altura = alturaDoItem(item, false, largura);
        centro -= alturaAnterior / 2 + espaco + altura / 2;
        alturaAnterior = altura;
        if (item.tipo === 'catalogo') return { offset, centro, nome: item.catalogo.nome };
    }

    return null;
};

function montaLayoutOrbital(itens: readonly ItemOrbital[], vCentro: number, tamanho: Tamanho): LayoutOrbital {
    const { largura, altura } = tamanho;
    if (largura <= 0 || altura <= 0 || itens.length === 0) return { itens: [], orbita: null, catalogoFixado: null };

    const total = itens.length;
    const raio = altura * RAZAO_RAIO_ALTURA;
    const apice = largura * RAZAO_APICE;
    const centroHorizontal = apice - raio;
    const folga = largura * RAZAO_FOLGA_ARCO;
    const centroVertical = altura / 2;
    const quedaOpacidade = altura * RAZAO_QUEDA_OPACIDADE;
    const espacoMinimo = largura * RAZAO_ESPACO_ITENS;
    const somaAlturas = itens.reduce((soma, item) => soma + alturaDoItem(item, false, largura), 0);
    const espaco = Math.max(espacoMinimo, (2 * raio * RAZAO_VAO_ALVO - somaAlturas) / total);

    const itemCentral = itens[mod(vCentro, total)];
    const alturaCentral = alturaDoItem(itemCentral, true, largura);

    const cabecalho = encontraCabecalhoAtual(itens, vCentro, total, itemCentral, alturaCentral, centroVertical, espaco, largura);
    const topoCabecalho = cabecalho ? cabecalho.centro - largura * RAZAO_ALTURA_HEADER / 2 : Number.POSITIVE_INFINITY;
    const fixarCatalogo = !!cabecalho && cabecalho.offset !== 0 && topoCabecalho < raio * 0.01;

    const renderizados: ItemRenderizado[] = [];

    const adiciona = (offset: number, centro: number, item: ItemOrbital, altura: number): void => {
        const deslocamentoVertical = centro - centroVertical;
        if (Math.abs(deslocamentoVertical) >= raio) return;
        if (fixarCatalogo && cabecalho && offset === cabecalho.offset) return;

        const arcoDireita = centroHorizontal + Math.sqrt(raio * raio - deslocamentoVertical * deslocamentoVertical);
        const central = offset === 0;
        const selecionado = central && item.tipo === 'missao';
        const distancia = Math.abs(offset);

        const estilo: CSSProperties = {
            top: `${centro - altura / 2}px`,
            right: `${largura - arcoDireita + folga}px`,
            height: `${altura}px`,
            fontSize: `${fonteDoItem(item, central, largura)}px`,
            opacity: central ? 1 : Math.max(0.34, 1 - Math.abs(deslocamentoVertical) / quedaOpacidade),
            zIndex: central ? 50 : Math.max(0, 20 - distancia),
        };
        if (item.tipo === 'missao') estilo.width = `${largura * (selecionado ? RAZAO_LARGURA_SELECIONADA : RAZAO_LARGURA_MISSAO)}px`;

        renderizados.push({ chave: `${vCentro + offset}`, vAbsoluto: vCentro + offset, item, estilo, ehCentral: central });
    };

    adiciona(0, centroVertical, itemCentral, alturaCentral);

    let centro = centroVertical;
    let alturaAnterior = alturaCentral;
    for (let offset = -1; offset > -total - 1; offset--) {
        const item = itens[mod(vCentro + offset, total)];
        const altura = alturaDoItem(item, false, largura);
        centro -= alturaAnterior / 2 + espaco + altura / 2;
        alturaAnterior = altura;
        if (centro + altura / 2 < centroVertical - raio) break;
        adiciona(offset, centro, item, altura);
    }

    centro = centroVertical;
    alturaAnterior = alturaCentral;
    for (let offset = 1; offset < total + 1; offset++) {
        const item = itens[mod(vCentro + offset, total)];
        const altura = alturaDoItem(item, false, largura);
        centro += alturaAnterior / 2 + espaco + altura / 2;
        alturaAnterior = altura;
        if (centro - altura / 2 > centroVertical + raio) break;
        adiciona(offset, centro, item, altura);
    }

    const orbita: CSSProperties = { left: `${centroHorizontal - raio}px`, top: `${centroVertical - raio}px`, width: `${raio * 2}px`, height: `${raio * 2}px` };
    const catalogoFixado = fixarCatalogo && cabecalho ? montaCatalogoFixado(cabecalho.nome, raio, centroHorizontal, centroVertical, folga, largura) : null;

    return { itens: renderizados, orbita, catalogoFixado };
};

function montaCatalogoFixado(nome: string, raio: number, centroHorizontal: number, centroVertical: number, folga: number, largura: number): CatalogoFixado {
    const topoFixado = largura * RAZAO_TOPO_FIXADO;
    const deslocamentoVertical = topoFixado + largura * RAZAO_ALTURA_HEADER / 2 - centroVertical;
    const arcoDireita = centroHorizontal + Math.sqrt(Math.max(0, raio * raio - deslocamentoVertical * deslocamentoVertical));

    return { nome, estilo: { top: `${topoFixado}px`, right: `${largura - arcoDireita + folga}px`, fontSize: `${largura * RAZAO_FONTE_HEADER}px` } };
};
