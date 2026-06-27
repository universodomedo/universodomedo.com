'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { EventosApiRest, Eventos_EnviaERecebe, PAGINAS, type EstruturaPartidas, type PainelDesafiosAtivos, type PartidaNoCatalogoResumo, type PartidaResumo, type RESPONSE__IniciarPartida, type WsErrorResponse } from 'types-nora-api';
import type { CatalogoDeMissoesCatalogo, CatalogoDeMissoesItem, CatalogoDeMissoesSubgrupo } from 'Componentes/ElementosDeJogo/CatalogoDeMissoes/CatalogoDeMissoes';

import { NoraApi } from 'Api/NoraApi';
import { eventoWs } from 'Hooks/useEventoWs';

export interface Contexto__PaginaPartidas__Props {
    catalogosDisponiveis: readonly CatalogoDeMissoesCatalogo[];
    idPartidaSelecionada: number | null;
    partidaSelecionada: PartidaResumo | null;
    podeJogarPartidaSelecionada: boolean;
    carregando: boolean;
    jogando: boolean;
    erro: string | null;
    selecionarPartida: (idPartida: number) => void;
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
    const [idPartidaSelecionada, setIdPartidaSelecionada] = useState<number | null>(null);

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
    const idsDisponiveis = useMemo<readonly number[]>(() => catalogosDisponiveis.flatMap(catalogo => [...catalogo.missoes.map(item => item.id), ...(catalogo.subgrupos ?? []).flatMap(subgrupo => subgrupo.itens.map(item => item.id))]), [catalogosDisponiveis]);

    useEffect(() => {
        if (idsDisponiveis.length === 0) {
            if (idPartidaSelecionada !== null) setIdPartidaSelecionada(null);
            return;
        }

        if (!idsDisponiveis.includes(idPartidaSelecionada ?? 0)) setIdPartidaSelecionada(idsDisponiveis[0]);
    }, [idsDisponiveis, idPartidaSelecionada]);

    const selecionarPartida = useCallback((idPartida: number) => setIdPartidaSelecionada(idPartida), []);

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

function adaptaPartida(partida: PartidaNoCatalogoResumo): CatalogoDeMissoesItem { return { id: partida.idPartida, nome: partida.nome }; };

function montaCatalogos(estrutura: EstruturaPartidas | null, painel: PainelDesafiosAtivos | null): readonly CatalogoDeMissoesCatalogo[] {
    if (!estrutura) return [];

    return estrutura.catalogos.map(catalogo => catalogo.tipo === 'DESAFIOS'
        ? { id: catalogo.id, nome: catalogo.nome, missoes: [], subgrupos: montaSubgruposDesafio(painel) }
        : { id: catalogo.id, nome: catalogo.nome, missoes: catalogo.partidas.map(adaptaPartida) });
};

function montaSubgruposDesafio(painel: PainelDesafiosAtivos | null): readonly CatalogoDeMissoesSubgrupo[] {
    if (!painel) return [];

    return painel.tipos.map(tipoPainel => ({
        id: tipoPainel.tipo,
        rotulo: `Desafio ${tipoPainel.rotulo}`,
        itens: tipoPainel.rotativo ? (tipoPainel.desafioAtivo ? [{ id: tipoPainel.desafioAtivo.id, nome: tipoPainel.desafioAtivo.nome }] : []) : tipoPainel.desafiosPublicados.map(desafio => ({ id: desafio.id, nome: desafio.nome })),
        mensagemVazio: tipoPainel.rotativo ? 'Esse Desafio não está ativo' : 'Nenhum Desafio encontrado',
    }));
};

function obtemPartidaPorId(estrutura: EstruturaPartidas | null, idPartida: number | null): PartidaResumo | null {
    if (!estrutura || idPartida === null) return null;

    return estrutura.partidas.find(partida => partida.id === idPartida) ?? null;
};
