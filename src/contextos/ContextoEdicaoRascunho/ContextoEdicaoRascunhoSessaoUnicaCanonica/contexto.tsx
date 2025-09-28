'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useContextoRascunho } from 'Contextos/ContextoRascunho/contexto';
import { DetalheRascunhoSessaoUnicaCanonicaDto, DificuldadeSessaoDto, RascunhoDto, TipoSessaoDto } from 'types-nora-api';

interface ContextoEdicaoRascunhoSessaoUnicaCanonicaProps {
    idDificuldadeSelecionado: number;
    setIdDificuldadeSelecionada: (v: number) => void;
    idTipoSelecionado: number;
    setIdTipoSelecionada: (v: number) => void;
    descricao: Record<string, any> | null;
    setDescricao: (v: Record<string, any> | null) => void;
    podeSalvar: boolean;
    handleSalvar: () => void;
};

const ContextoEdicaoRascunhoSessaoUnicaCanonica = createContext<ContextoEdicaoRascunhoSessaoUnicaCanonicaProps | undefined>(undefined);

export const useContextoEdicaoRascunhoSessaoUnicaCanonica = (): ContextoEdicaoRascunhoSessaoUnicaCanonicaProps => {
    const context = useContext(ContextoEdicaoRascunhoSessaoUnicaCanonica);
    if (!context) throw new Error('useContextoEdicaoRascunhoSessaoUnicaCanonica precisa estar dentro de um ContextoEdicaoRascunhoSessaoUnicaCanonica');
    return context;
};

export const ContextoEdicaoRascunhoSessaoUnicaCanonicaProvider = ({ children }: { children: React.ReactNode }) => {
    const { salvaDetalhesRascunhoSessaoUnicaCanonica, rascunho } = useContextoRascunho();

    const [idDificuldadeSelecionado, setIdDificuldadeSelecionada] = useState(rascunho?.detalheRascunhoSessaoUnicaCanonica ? rascunho?.detalheRascunhoSessaoUnicaCanonica.dificuldadeSessao.id : 0);
    const [idTipoSelecionado, setIdTipoSelecionada] = useState(rascunho?.detalheRascunhoSessaoUnicaCanonica ? rascunho?.detalheRascunhoSessaoUnicaCanonica.tipoSessao.id : 0);
    const [descricao, setDescricao] = useState(rascunho?.detalheRascunhoSessaoUnicaCanonica ? rascunho?.detalheRascunhoSessaoUnicaCanonica.descricao : null);

    //

    const detalheInicial = {
        idDificuldadeSelecionado: rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.dificuldadeSessao.id : 0,
        idTipoSelecionado: rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.tipoSessao.id : 0,
        descricao: rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.descricao : null,
    };

    const houveModificacao = idDificuldadeSelecionado !== detalheInicial.idDificuldadeSelecionado || idTipoSelecionado !== detalheInicial.idTipoSelecionado || JSON.stringify(descricao) !== JSON.stringify(detalheInicial.descricao);

    //

    const podeSalvar: boolean = (idDificuldadeSelecionado > 0 && idTipoSelecionado > 0 && houveModificacao);

    const handleSalvar = () => {
        const alteracoes: string[] = [];

        if (idDificuldadeSelecionado !== detalheInicial.idDificuldadeSelecionado)
            alteracoes.push("Dificuldade da sessão foi alterada");

        if (idTipoSelecionado !== detalheInicial.idTipoSelecionado)
            alteracoes.push("Tipo de sessão foi alterado");

        if (JSON.stringify(descricao) !== JSON.stringify(detalheInicial.descricao))
            alteracoes.push("Descrição foi alterada");

        if (alteracoes.length < 1) return;

        const confirmacao = window.confirm(
            "Tem certeza que deseja salvar as alterações?\n\n" +
            alteracoes.map(a => `• ${a}`).join("\n")
        );

        if (!confirmacao) return;

        salvaDetalhesRascunhoSessaoUnicaCanonica({
            rascunho: { id: rascunho?.id } as RascunhoDto,
            tipoSessao: { id: idTipoSelecionado } as TipoSessaoDto,
            dificuldadeSessao: { id: idDificuldadeSelecionado } as DificuldadeSessaoDto,
            descricao: descricao,
        } as DetalheRascunhoSessaoUnicaCanonicaDto);
    };

    return (
        <ContextoEdicaoRascunhoSessaoUnicaCanonica.Provider value={{ idDificuldadeSelecionado, setIdDificuldadeSelecionada, idTipoSelecionado, setIdTipoSelecionada, descricao, setDescricao, podeSalvar, handleSalvar }}>
            {children}
        </ContextoEdicaoRascunhoSessaoUnicaCanonica.Provider>
    );
};