'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { PAYLOAD__CriarSalaChat, PAYLOAD__AtualizarSalaChat, EstadoSalaChat } from 'types-nora-api';

import useNoraGraphQLListagem from 'Hooks/useNoraGraphQLListagem';
import { criaSalaChat, atualizaSalaChat, defineEstadoSalaChat } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export type RegistroSalaChat = ReturnType<typeof obtemListagemSalasChat>['registros'][number];

export interface Contexto__PaginaAdminSalasChat__Props {
    listagemSalas: ReturnType<typeof obtemListagemSalasChat>;
    salaEmEdicao: RegistroSalaChat | null;
    estaEmCriacaoSala: boolean;
    iniciarCriacaoSala: () => void;
    editarSala: (sala: RegistroSalaChat) => void;
    cancelarFormulario: () => void;
    salvarNovaSala: (dados: PAYLOAD__CriarSalaChat) => Promise<void>;
    salvarEdicaoSala: (dados: PAYLOAD__AtualizarSalaChat) => Promise<void>;
    definirEstadoSala: (id: number, estado: EstadoSalaChat) => Promise<void>;
};

const Contexto__PaginaAdminSalasChat = createContext<Contexto__PaginaAdminSalasChat__Props | undefined>(undefined);

export const useContexto__PaginaAdminSalasChat = (): Contexto__PaginaAdminSalasChat__Props => {
    const context = useContext(Contexto__PaginaAdminSalasChat);
    if (!context) throw new Error('useContexto__PaginaAdminSalasChat precisa estar dentro de um Contexto__PaginaAdminSalasChat');
    return context;
};

export const Contexto__PaginaAdminSalasChat__Provider = ({ children }: { children: React.ReactNode }) => {
    const listagemSalas = obtemListagemSalasChat();

    const [salaEmEdicao, setSalaEmEdicao] = useState<RegistroSalaChat | null>(null);
    const [estaEmCriacaoSala, setEstaEmCriacaoSala] = useState<boolean>(false);

    const cancelarFormulario = useCallback(() => { setSalaEmEdicao(null); setEstaEmCriacaoSala(false); }, []);

    const iniciarCriacaoSala = useCallback(() => { cancelarFormulario(); setEstaEmCriacaoSala(true); }, [cancelarFormulario]);
    const editarSala = useCallback((sala: RegistroSalaChat) => { cancelarFormulario(); setSalaEmEdicao(sala); }, [cancelarFormulario]);

    const recarregarSalas = listagemSalas.recarregar;

    const salvarNovaSala = useCallback(async (dados: PAYLOAD__CriarSalaChat): Promise<void> => { await criaSalaChat(dados); recarregarSalas(); cancelarFormulario(); }, [recarregarSalas, cancelarFormulario]);
    const salvarEdicaoSala = useCallback(async (dados: PAYLOAD__AtualizarSalaChat): Promise<void> => { await atualizaSalaChat(dados); recarregarSalas(); cancelarFormulario(); }, [recarregarSalas, cancelarFormulario]);
    const definirEstadoSala = useCallback(async (id: number, estado: EstadoSalaChat): Promise<void> => { await defineEstadoSalaChat({ id, estado }); recarregarSalas(); }, [recarregarSalas]);

    return (
        <Contexto__PaginaAdminSalasChat.Provider value={{ listagemSalas, salaEmEdicao, estaEmCriacaoSala, iniciarCriacaoSala, editarSala, cancelarFormulario, salvarNovaSala, salvarEdicaoSala, definirEstadoSala }}>
            {children}
        </Contexto__PaginaAdminSalasChat.Provider>
    );
};

export function obtemListagemSalasChat() {
    return useNoraGraphQLListagem('SalaChat', {
        select: ['id', 'nome', 'estado', 'leituraPublica', 'escritaPublica'],
        camposFiltroConsulta: ['nome'],
        camposFiltroVisualizacao: ['nome'],
        itensPorPagina: 200,
        carregando: 'Buscando salas',
        mensagemErro: 'Houve um erro recuperando as salas',
        mensagemListaVazia: 'Nenhuma sala cadastrada.',
        mensagemListaVaziaComFiltro: 'Nenhuma sala encontrada com os filtros atuais.',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: params => ({ where: params.where, order: { id: 'ASC' }, limit: params.limit, offset: params.offset }),
        montaParametrosTotalDeRegistros: where => ({ where }),
    });
};
