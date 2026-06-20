'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { EstruturaMissoesJogaveis, EventosApiRest, Eventos_EnviaERecebe, PAGINAS, type CatalogoMissaoJogavelResumo, type CodigoMissaoFuncionalSalaDeJogoRuntime, type RESPONSE__IniciarModoSolo, type WsErrorResponse } from 'types-nora-api';

import { NoraApi } from 'Api/NoraApi';
import { eventoWs } from 'Hooks/useEventoWs';

export interface Contexto__PaginaModoSolo__Props {
    catalogosDisponiveis: readonly CatalogoMissaoJogavelResumo[];
    idMissaoSelecionada: number | null;
    podeIniciarMissaoSelecionada: boolean;
    carregando: boolean;
    iniciandoMissao: boolean;
    erro: string | null;
    selecionarMissao: (idMissao: number) => void;
    iniciarMissaoSelecionada: () => void;
};

const Contexto__PaginaModoSolo = createContext<Contexto__PaginaModoSolo__Props | undefined>(undefined);

export const useContexto__PaginaModoSolo = (): Contexto__PaginaModoSolo__Props => {
    const context = useContext(Contexto__PaginaModoSolo);
    if (!context) throw new Error('useContexto__PaginaModoSolo precisa estar dentro de um Contexto__PaginaModoSolo');
    return context;
};

export const Contexto__PaginaModoSolo__Provider = ({ children }: { readonly children: ReactNode; }) => {
    const router = useRouter();
    const [estrutura, setEstrutura] = useState<EstruturaMissoesJogaveis | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [iniciandoMissao, setIniciandoMissao] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [idMissaoSelecionada, setIdMissaoSelecionada] = useState<number | null>(null);

    useEffect(() => {
        async function carregarEstrutura(): Promise<void> {
            setCarregando(true);
            setErro(null);

            try {
                const resposta = await NoraApi.RestGET(EventosApiRest.GET.MissoesJogaveis.estrutura, {}, { mensagemErro: 'Não foi possível carregar as Missões do Modo Solo.' });
                setEstrutura(resposta);
            } catch {
                setErro('Não foi possível carregar as Missões do Modo Solo.');
            } finally {
                setCarregando(false);
            }
        };

        void carregarEstrutura();
    }, []);

    const catalogosDisponiveis = useMemo<readonly CatalogoMissaoJogavelResumo[]>(() => {
        if (!estrutura) return [];

        return estrutura.catalogos.filter(catalogo => catalogo.ativo).map(catalogo => ({ ...catalogo, missoes: catalogo.missoes.filter(missao => missao.ativo) }));
    }, [estrutura]);

    const idsMissoesDisponiveis = useMemo<readonly number[]>(() => montaIdsMissoesDisponiveis(catalogosDisponiveis), [catalogosDisponiveis]);

    useEffect(() => {
        if (idsMissoesDisponiveis.length === 0) {
            if (idMissaoSelecionada !== null) setIdMissaoSelecionada(null);
            return;
        }

        if (!idsMissoesDisponiveis.includes(idMissaoSelecionada ?? 0)) setIdMissaoSelecionada(idsMissoesDisponiveis[0]);
    }, [idsMissoesDisponiveis, idMissaoSelecionada]);

    const selecionarMissao = useCallback((idMissao: number) => {
        setIdMissaoSelecionada(idMissao);
    }, []);

    const codigoMissaoFuncionalSelecionada = resolveCodigoMissaoFuncional(idMissaoSelecionada);
    const podeIniciarMissaoSelecionada = codigoMissaoFuncionalSelecionada !== null;

    const iniciarMissaoSelecionada = useCallback(() => {
        const codigoMissaoFuncional = resolveCodigoMissaoFuncional(idMissaoSelecionada);
        if (!codigoMissaoFuncional || iniciandoMissao) return;

        setIniciandoMissao(true);
        setErro(null);

        eventoWs(Eventos_EnviaERecebe.Jogo.eventos.iniciarModoSolo, { codigoMissaoFuncional }, {
            onSuccess: (_response: RESPONSE__IniciarModoSolo) => {
                router.replace(PAGINAS.jogo.emJogo.href);
            },
            onError: (error: WsErrorResponse) => {
                setIniciandoMissao(false);
                setErro(error.mensagem ?? 'Não foi possível iniciar a Missão Funcional.');
            },
            timeoutMs: 8000,
        });
    }, [idMissaoSelecionada, iniciandoMissao, router]);

    return (
        <Contexto__PaginaModoSolo.Provider value={{ catalogosDisponiveis, idMissaoSelecionada, podeIniciarMissaoSelecionada, carregando, iniciandoMissao, erro, selecionarMissao, iniciarMissaoSelecionada }}>
            {children}
        </Contexto__PaginaModoSolo.Provider>
    );
};

function montaIdsMissoesDisponiveis(catalogos: readonly CatalogoMissaoJogavelResumo[]): readonly number[] {
    const idsMissoes: number[] = [];

    catalogos.forEach(catalogo => {
        catalogo.missoes.forEach(missao => {
            idsMissoes.push(missao.id);
        });
    });

    return idsMissoes;
};

function resolveCodigoMissaoFuncional(idMissao: number | null): CodigoMissaoFuncionalSalaDeJogoRuntime | null {
    if (idMissao === 1) return 'MISSAO_FUNCIONAL_1';
    if (idMissao === 2) return 'MISSAO_FUNCIONAL_2_OUVIR_REFEM';
    if (idMissao === 3) return 'MISSAO_FUNCIONAL_3_DERROTE_INIMIGO';
    if (idMissao === 4) return 'MISSAO_FUNCIONAL_4_TEMPO_REAL';
    return null;
};
