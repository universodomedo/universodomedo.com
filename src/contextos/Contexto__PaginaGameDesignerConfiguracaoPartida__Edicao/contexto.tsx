'use client';

import { createContext, useContext, useState } from 'react';
import type { PartidaResumo } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaGameDesignerConfiguracaoPartida__Props } from '../Contexto__PaginaGameDesignerConfiguracaoPartida/contexto';
import SPA__PaginaGameDesignerConfiguracaoPartida__Edicao from 'Conteineres/PaginaGameDesignerConfiguracaoPartida/paginas/SPA__PaginaGameDesignerConfiguracaoPartida__Edicao/SPA__PaginaGameDesignerConfiguracaoPartida__Edicao';

interface Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao__Props {
    partida: PartidaResumo;
    salvando: boolean;
    nome: string;
    setNome: (nome: string) => void;
    podeSalvarNome: boolean;
    salvarNome: () => Promise<void>;
    configurarRuntime: () => void;
    configurarDetalhes: () => Promise<void>;
    deletar: () => Promise<void>;
};

type PropsProvider = {
    partida: PartidaResumo;
    salvando: boolean;
    salvarPartida: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['salvarPartida'];
    deletarPartida: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['deletarPartida'];
    abrirConfiguracao: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['abrirConfiguracao'];
    abrirDetalhes: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['abrirDetalhes'];
    voltaParaListagem: Contexto__PaginaGameDesignerConfiguracaoPartida__Props['voltaParaListagem'];
};

const Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao = createContext<Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao__Props | undefined>(undefined);

export const useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao = (): Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao__Props => {
    const context = useContext(Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao);
    if (!context) throw new Error('useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao precisa estar dentro de um Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao');
    return context;
};

export const Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao__Provider = ({ partida, salvando, salvarPartida, deletarPartida, abrirConfiguracao, abrirDetalhes, voltaParaListagem }: PropsProvider) => {
    useConfigurarLayoutContextualizado({ titulo: 'Editando Partida', subtitulo: `${partida.nome}`, fecharProps: { tipo: 'acao', executar: voltaParaListagem, tituloTooltip: 'Voltar para Listagem' } });

    const [nome, setNome] = useState(partida.nome);

    const nomeNormalizado = nome.trim();
    const podeSalvarNome = nomeNormalizado.length > 0 && nomeNormalizado !== partida.nome;

    async function salvarNome(): Promise<void> {
        if (!podeSalvarNome) return;
        await salvarPartida({ id: partida.id, nome: nomeNormalizado });
    };

    function configurarRuntime(): void { abrirConfiguracao(partida); };

    // Detalhes só edita a Arte de Capa — garante o nome salvo/atualizado antes de entrar, e leva o nome corrente.
    async function configurarDetalhes(): Promise<void> {
        if (podeSalvarNome) await salvarPartida({ id: partida.id, nome: nomeNormalizado });
        abrirDetalhes({ ...partida, nome: nomeNormalizado });
    };

    async function deletar(): Promise<void> { await deletarPartida({ idPartida: partida.id }); };

    return (
        <Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao.Provider value={{ partida, salvando, nome, setNome, podeSalvarNome, salvarNome, configurarRuntime, configurarDetalhes, deletar }}>
            <SPA__PaginaGameDesignerConfiguracaoPartida__Edicao />
        </Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao.Provider>
    );
};
