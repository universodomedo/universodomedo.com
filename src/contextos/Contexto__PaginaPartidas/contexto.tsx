'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { EventosApiRest, Eventos_EnviaERecebe, PAGINAS, type EstruturaPartidas, type PainelDesafiosAtivos, type PartidaResumo, type RESPONSE__IniciarPartida, type WsErrorResponse } from 'types-nora-api';
import type { CatalogoDeMissoesCatalogo, CatalogoDeMissoesItem, CatalogoDeMissoesSubgrupo } from 'Componentes/ElementosDeJogo/CatalogoDeMissoes/CatalogoDeMissoes';

import { NoraApi } from 'Api/NoraApi';
import { eventoWs } from 'Hooks/useEventoWs';
import { useValorEstabilizado } from 'Hooks/useValorEstabilizado';

// Debounce ÚNICO da transição de item do Orbital: fundo, música e Detalhe saem TODOS da mesma seleção estável. NÃO criar outros timers com este mesmo tempo — a transição do item é uma coisa só.
const ATRASO_ESTABILIZACAO_MS = 220;

export interface Contexto__PaginaPartidas__Props {
    catalogosDisponiveis: readonly CatalogoDeMissoesCatalogo[];
    idPartidaSelecionada: number | null;
    partidaSelecionada: PartidaResumo | null;
    podeJogarPartidaSelecionada: boolean;
    carregando: boolean;
    jogando: boolean;
    erro: string | null;
    selecionarPartida: (idPartida: number | null) => void;
    jogarPartidaSelecionada: () => void;
};

const Contexto__PaginaPartidas = createContext<Contexto__PaginaPartidas__Props | undefined>(undefined);

export const useContexto__PaginaPartidas = (): Contexto__PaginaPartidas__Props => {
    const context = useContext(Contexto__PaginaPartidas);
    if (!context) throw new Error('useContexto__PaginaPartidas precisa estar dentro de um Contexto__PaginaPartidas');
    return context;
};

export const Contexto__PaginaPartidas__Provider = ({ children }: { readonly children: ReactNode; }) => {
    const router = useRouter();
    const [estrutura, setEstrutura] = useState<EstruturaPartidas | null>(null);
    const [painel, setPainel] = useState<PainelDesafiosAtivos | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [jogando, setJogando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [idPartidaFocada, setIdPartidaFocada] = useState<number | null>(null);

    useEffect(() => {
        async function carregar(): Promise<void> {
            setCarregando(true);
            setErro(null);

            try {
                const [respostaEstrutura, respostaPainel] = await Promise.all([
                    NoraApi.RestGET(EventosApiRest.GET.Partidas.estruturaOrbital, {}, { mensagemErro: 'Não foi possível carregar as Partidas.' }),
                    NoraApi.RestGET(EventosApiRest.GET.DesafiosAtivos.painel, {}, { mensagemErro: 'Não foi possível carregar os Desafios.' }),
                ]);
                setEstrutura(respostaEstrutura);
                setPainel(respostaPainel);
            } catch {
                setErro('Não foi possível carregar as Partidas.');
            } finally {
                setCarregando(false);
            }
        };

        void carregar();
    }, []);

    const catalogosDisponiveis = useMemo<readonly CatalogoDeMissoesCatalogo[]>(() => montaCatalogos(estrutura, painel), [estrutura, painel]);

    const selecionarPartida = useCallback((idPartida: number | null) => setIdPartidaFocada(idPartida), []);

    // O foco muda a cada item durante o scroll; a seleção só ASSENTA (e comita fundo/música/Detalhe juntos) quando o foco fica parado por ATRASO_ESTABILIZACAO_MS.
    const idPartidaSelecionada = useValorEstabilizado(idPartidaFocada, ATRASO_ESTABILIZACAO_MS);
    const partidaSelecionada = useMemo<PartidaResumo | null>(() => obtemPartidaPorId(estrutura, idPartidaSelecionada), [estrutura, idPartidaSelecionada]);
    const podeJogarPartidaSelecionada = partidaSelecionada?.partidaConfigurada === true;

    const jogarPartidaSelecionada = useCallback(() => {
        if (!partidaSelecionada || !podeJogarPartidaSelecionada || jogando) return;

        setJogando(true);
        setErro(null);

        eventoWs(Eventos_EnviaERecebe.Jogo.eventos.iniciarPartida, { idPartida: partidaSelecionada.id }, {
            onSuccess: (_response: RESPONSE__IniciarPartida) => {
                router.replace(PAGINAS.jogo.emJogo.href);
            },
            onError: (error: WsErrorResponse) => {
                setJogando(false);
                setErro(error.mensagem ?? 'Não foi possível iniciar a Partida.');
            },
            timeoutMs: 8000,
        });
    }, [partidaSelecionada, podeJogarPartidaSelecionada, jogando, router]);

    return (
        <Contexto__PaginaPartidas.Provider value={{ catalogosDisponiveis, idPartidaSelecionada, partidaSelecionada, podeJogarPartidaSelecionada, carregando, jogando, erro, selecionarPartida, jogarPartidaSelecionada }}>
            {children}
        </Contexto__PaginaPartidas.Provider>
    );
};

// Contrato ÚNICO de item do Orbital, derivado SEMPRE da Partida (a fonte de verdade). Missão e Desafio produzem o MESMO item pela MESMA função — o id do Desafio é o id da Partida.
function montaItemOrbital(partida: PartidaResumo): CatalogoDeMissoesItem { return { id: partida.id, nome: partida.nome, arteCapa: partida.arteCapa }; };

function ehItemOrbital(item: CatalogoDeMissoesItem | null): item is CatalogoDeMissoesItem { return item !== null; };

function montaCatalogos(estrutura: EstruturaPartidas | null, painel: PainelDesafiosAtivos | null): readonly CatalogoDeMissoesCatalogo[] {
    if (!estrutura) return [];

    const partidas = estrutura.partidas;
    const itemPorIdPartida = (idPartida: number): CatalogoDeMissoesItem | null => {
        const partida = partidas.find(item => item.id === idPartida);
        return partida ? montaItemOrbital(partida) : null;
    };

    return estrutura.catalogos.map(catalogo => catalogo.tipo === 'DESAFIOS'
        ? { id: catalogo.id, nome: catalogo.nome, missoes: [], subgrupos: montaSubgruposDesafio(painel, itemPorIdPartida) }
        : { id: catalogo.id, nome: catalogo.nome, missoes: catalogo.partidas.map(partida => itemPorIdPartida(partida.idPartida)).filter(ehItemOrbital) });
};

function montaSubgruposDesafio(painel: PainelDesafiosAtivos | null, itemPorIdPartida: (idPartida: number) => CatalogoDeMissoesItem | null): readonly CatalogoDeMissoesSubgrupo[] {
    if (!painel) return [];

    return painel.tipos.map(tipoPainel => {
        // O painel só diz QUAIS partidas e como agrupar; o item em si sai da Partida, pelo mesmo caminho das Missões.
        const idsPartida = tipoPainel.rotativo ? (tipoPainel.desafioAtivo ? [tipoPainel.desafioAtivo.id] : []) : tipoPainel.desafiosPublicados.map(desafio => desafio.id);

        return {
            id: tipoPainel.tipo,
            rotulo: `Desafio ${tipoPainel.rotulo}`,
            itens: idsPartida.map(itemPorIdPartida).filter(ehItemOrbital),
            mensagemVazio: tipoPainel.rotativo ? 'Esse Desafio não está ativo' : 'Nenhum Desafio encontrado',
        };
    });
};

function obtemPartidaPorId(estrutura: EstruturaPartidas | null, idPartida: number | null): PartidaResumo | null {
    if (!estrutura || idPartida === null) return null;

    return estrutura.partidas.find(partida => partida.id === idPartida) ?? null;
};
