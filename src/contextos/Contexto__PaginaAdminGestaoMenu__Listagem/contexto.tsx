'use client';

import { createContext, useContext, useMemo } from 'react';

import type { MenuNoDoBancoDto } from 'types-nora-api';
import { useContexto__PaginaAdminGestaoMenu, obtemListagemMenus } from '../Contexto__PaginaAdminGestaoMenu/contexto';
import SPA__PaginaAdminGestaoMenu__Listagem from 'Conteineres/PaginaAdminGestaoMenu/paginas/SPA__PaginaAdminGestaoMenu__Listagem/SPA__PaginaAdminGestaoMenu__Listagem';

// Resumo estrutural do card de menu, derivado da navegação completa (já carregada) — a listagem GraphQL não precisa expor contagens.
export type ResumoMenuGestao = { ativo: boolean; itens: number; grupos: number };

interface Contexto__PaginaAdminGestaoMenu__Listagem__Props {
    listagemMenus: ReturnType<typeof obtemListagemMenus>;
    resumoPorMenuId: ReadonlyMap<number, ResumoMenuGestao>;
    estaEmCriacaoMenu: boolean;
    selecionarMenu: (idMenu: number) => void;
    iniciarCriacaoMenu: () => void;
};

const Contexto__PaginaAdminGestaoMenu__Listagem = createContext<Contexto__PaginaAdminGestaoMenu__Listagem__Props | undefined>(undefined);

export const useContexto__PaginaAdminGestaoMenu__Listagem = (): Contexto__PaginaAdminGestaoMenu__Listagem__Props => {
    const context = useContext(Contexto__PaginaAdminGestaoMenu__Listagem);
    if (!context) throw new Error('useContexto__PaginaAdminGestaoMenu__Listagem precisa estar dentro de um Contexto__PaginaAdminGestaoMenu__Listagem');
    return context;
};

// Subfluxo Listagem: grade de cards de menu (ListagemComposta) — a primeira decisão do fluxo é ESCOLHER o menu; nenhuma árvore aparece aqui.
export const Contexto__PaginaAdminGestaoMenu__Listagem__Provider = () => {
    const { listagemMenus, navegacao, subVista, selecionarMenu, irParaNovoMenu } = useContexto__PaginaAdminGestaoMenu();

    const resumoPorMenuId = useMemo(() => {
        const mapa = new Map<number, ResumoMenuGestao>();
        for (const menu of navegacao ?? []) mapa.set(menu.id, { ativo: menu.ativo, ...contaNos(menu.nos) });
        return mapa;
    }, [navegacao]);

    return (
        <Contexto__PaginaAdminGestaoMenu__Listagem.Provider value={{ listagemMenus, resumoPorMenuId, estaEmCriacaoMenu: subVista === 'novoMenu', selecionarMenu, iniciarCriacaoMenu: irParaNovoMenu }}>
            <SPA__PaginaAdminGestaoMenu__Listagem />
        </Contexto__PaginaAdminGestaoMenu__Listagem.Provider>
    );
};

function contaNos(nos: readonly MenuNoDoBancoDto[]): { itens: number; grupos: number } {
    let itens = 0;
    let grupos = 0;
    for (const no of nos) {
        if (no.tipo === 'grupo') grupos += 1;
        else itens += 1;
        const filhos = contaNos(no.filhos);
        itens += filhos.itens;
        grupos += filhos.grupos;
    }
    return { itens, grupos };
};
