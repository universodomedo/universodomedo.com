'use client';

import { createContext, useContext, useState } from 'react';
import type { CatalogoPartidaResumo, PartidaNoCatalogoResumo, PartidaResumo } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerCatalogosPartida__Props } from '../Contexto__PaginaGameDesignerCatalogosPartida/contexto';
import SPA__PaginaGameDesignerCatalogosPartida__Edicao from 'Conteineres/PaginaGameDesignerCatalogosPartida/paginas/SPA__PaginaGameDesignerCatalogosPartida__Edicao/SPA__PaginaGameDesignerCatalogosPartida__Edicao';

interface Contexto__PaginaGameDesignerCatalogosPartida__Edicao__Props {
    catalogo: CatalogoPartidaResumo;
    partidasNoCatalogo: readonly PartidaNoCatalogoResumo[];
    partidasDisponiveis: readonly PartidaResumo[];
    salvando: boolean;
    nome: string;
    setNome: (nome: string) => void;
    podeSalvarNome: boolean;
    salvarNome: () => Promise<void>;
    alternarAtivoCatalogo: (ativo: boolean) => Promise<void>;
    deletar: () => Promise<void>;
    adicionarPartidaAoCatalogo: (idPartida: number) => Promise<void>;
    removerPartidaDoCatalogo: (idPartida: number) => Promise<void>;
    alternarExibicaoPartida: (idPartida: number, ativo: boolean) => Promise<void>;
    reordenarPartidasDoCatalogo: (idsPartidaOrdenados: readonly number[]) => Promise<void>;
};

type PropsProvider = {
    catalogo: CatalogoPartidaResumo;
    todasPartidas: readonly PartidaResumo[];
    salvando: boolean;
    salvarCatalogo: Contexto__PaginaGameDesignerCatalogosPartida__Props['salvarCatalogo'];
    deletarCatalogo: Contexto__PaginaGameDesignerCatalogosPartida__Props['deletarCatalogo'];
    adicionarPartida: Contexto__PaginaGameDesignerCatalogosPartida__Props['adicionarPartida'];
    removerPartida: Contexto__PaginaGameDesignerCatalogosPartida__Props['removerPartida'];
    alternarExibicao: Contexto__PaginaGameDesignerCatalogosPartida__Props['alternarExibicao'];
    reordenarPartidas: Contexto__PaginaGameDesignerCatalogosPartida__Props['reordenarPartidas'];
    voltaParaListagem: Contexto__PaginaGameDesignerCatalogosPartida__Props['voltaParaListagem'];
};

const Contexto__PaginaGameDesignerCatalogosPartida__Edicao = createContext<Contexto__PaginaGameDesignerCatalogosPartida__Edicao__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerCatalogosPartida__Edicao = (): Contexto__PaginaGameDesignerCatalogosPartida__Edicao__Props => {
    const context = useContext(Contexto__PaginaGameDesignerCatalogosPartida__Edicao);
    if (!context) throw new Error('useContexto__PaginaGameDesignerCatalogosPartida__Edicao precisa estar dentro de um Contexto__PaginaGameDesignerCatalogosPartida__Edicao');
    return context;
};

export const Contexto__PaginaGameDesignerCatalogosPartida__Edicao__Provider = ({ catalogo, todasPartidas, salvando, salvarCatalogo, deletarCatalogo, adicionarPartida, removerPartida, alternarExibicao, reordenarPartidas, voltaParaListagem }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ titulo: 'Editando Catálogo', subtitulo: `${catalogo.nome}`, fecharProps: { tipo: 'acao', executar: voltaParaListagem, tituloTooltip: 'Voltar para Listagem' } });

    const [nome, setNome] = useState(catalogo.nome);

    const nomeNormalizado = nome.trim();
    const podeSalvarNome = nomeNormalizado.length > 0 && nomeNormalizado !== catalogo.nome;

    const idsNoCatalogo = new Set(catalogo.partidas.map(partida => partida.idPartida));
    const partidasDisponiveis = todasPartidas.filter(partida => !idsNoCatalogo.has(partida.id));

    async function salvarNome(): Promise<void> {
        if (!podeSalvarNome) return;
        await salvarCatalogo({ id: catalogo.id, nome: nomeNormalizado, ativo: catalogo.ativo, ordem: catalogo.ordem });
    };

    async function alternarAtivoCatalogo(ativo: boolean): Promise<void> {
        await salvarCatalogo({ id: catalogo.id, nome: catalogo.nome, ativo, ordem: catalogo.ordem });
    };

    async function deletar(): Promise<void> { await deletarCatalogo({ idCatalogo: catalogo.id }); };

    async function adicionarPartidaAoCatalogo(idPartida: number): Promise<void> { await adicionarPartida({ idCatalogo: catalogo.id, idPartida }); };

    async function removerPartidaDoCatalogo(idPartida: number): Promise<void> { await removerPartida({ idCatalogo: catalogo.id, idPartida }); };

    async function alternarExibicaoPartida(idPartida: number, ativo: boolean): Promise<void> { await alternarExibicao({ idCatalogo: catalogo.id, idPartida, ativo }); };

    async function reordenarPartidasDoCatalogo(idsPartidaOrdenados: readonly number[]): Promise<void> { await reordenarPartidas({ idCatalogo: catalogo.id, idsPartidaOrdenados }); };

    return (
        <Contexto__PaginaGameDesignerCatalogosPartida__Edicao.Provider value={{ catalogo, partidasNoCatalogo: catalogo.partidas, partidasDisponiveis, salvando, nome, setNome, podeSalvarNome, salvarNome, alternarAtivoCatalogo, deletar, adicionarPartidaAoCatalogo, removerPartidaDoCatalogo, alternarExibicaoPartida, reordenarPartidasDoCatalogo }}>
            <SPA__PaginaGameDesignerCatalogosPartida__Edicao />
        </Contexto__PaginaGameDesignerCatalogosPartida__Edicao.Provider>
    );
};
