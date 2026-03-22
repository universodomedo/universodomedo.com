'use client';

import { createContext, useContext, useState } from 'react';

import { useContextoRascunho } from 'Contextos/ContextoRascunho/contexto';
import { DificuldadeSessaoCompletaDto, PAYLOAD_DetalheRascunhoSessaoUnicaCanonicaEdicaoDto, RascunhoSessaoUnicaCanonicaCompletaDto, TipoSessaoDto } from 'types-nora-api';

interface ContextoEdicaoRascunhoSessaoUnicaCanonicaProps {
    idDificuldadeSelecionado: number;
    setIdDificuldadeSelecionada: (v: number) => void;
    idTipoSelecionado: number;
    setIdTipoSelecionada: (v: number) => void;
    descricao: Record<string, any>;
    setDescricao: (v: Record<string, any>) => void;
    podeSalvar: boolean;
    handleSalvar: () => void;
};

const ContextoEdicaoRascunhoSessaoUnicaCanonica = createContext<ContextoEdicaoRascunhoSessaoUnicaCanonicaProps | undefined>(undefined);

export const useContextoEdicaoRascunhoSessaoUnicaCanonica = (): ContextoEdicaoRascunhoSessaoUnicaCanonicaProps => {
    const context = useContext(ContextoEdicaoRascunhoSessaoUnicaCanonica);
    if (!context) throw new Error('useContextoEdicaoRascunhoSessaoUnicaCanonica precisa estar dentro de um ContextoEdicaoRascunhoSessaoUnicaCanonica');
    return context;
};

export const ContextoEdicaoRascunhoSessaoUnicaCanonicaProvider = ({ children, rascunho }: { children: React.ReactNode; rascunho: RascunhoSessaoUnicaCanonicaCompletaDto; }) => {
    const { salvaDetalhesRascunho } = useContextoRascunho();

    const [idDificuldadeSelecionado, setIdDificuldadeSelecionada] = useState(rascunho.detalheRascunho ? rascunho.detalheRascunho.dificuldadeSessao.id : 0);
    const [idTipoSelecionado, setIdTipoSelecionada] = useState(rascunho.detalheRascunho ? rascunho.detalheRascunho.tipoSessao.id : 0);
    const [descricao, setDescricao] = useState<Record<string, any>>(rascunho.detalheRascunho ? rascunho.detalheRascunho.descricao : {});

    const detalheInicial = {
        idDificuldadeSelecionado: rascunho.detalheRascunho ? rascunho.detalheRascunho.dificuldadeSessao.id : 0,
        idTipoSelecionado: rascunho.detalheRascunho ? rascunho.detalheRascunho.tipoSessao.id : 0,
        descricao: rascunho.detalheRascunho ? rascunho.detalheRascunho.descricao : {},
    };

    const houveModificacao = idDificuldadeSelecionado !== detalheInicial.idDificuldadeSelecionado || idTipoSelecionado !== detalheInicial.idTipoSelecionado || JSON.stringify(descricao) !== JSON.stringify(detalheInicial.descricao);

    const podeSalvar: boolean = idDificuldadeSelecionado > 0 && idTipoSelecionado > 0 && houveModificacao;

    const handleSalvar = () => {
        const alteracoes: string[] = [];

        if (idDificuldadeSelecionado !== detalheInicial.idDificuldadeSelecionado) alteracoes.push('Dificuldade da sessão foi alterada');
        if (idTipoSelecionado !== detalheInicial.idTipoSelecionado) alteracoes.push('Tipo de sessão foi alterado');
        if (JSON.stringify(descricao) !== JSON.stringify(detalheInicial.descricao)) alteracoes.push('Descrição foi alterada');

        if (alteracoes.length < 1) return;

        const confirmacao = window.confirm(
            'Tem certeza que deseja salvar as alterações?\n\n' +
            alteracoes.map(a => `• ${a}`).join('\n')
        );

        if (!confirmacao) return;

        salvaDetalhesRascunho({
            fkRascunhoId: rascunho.id,
            tipoSessao: { id: idTipoSelecionado } as TipoSessaoDto,
            dificuldadeSessao: { id: idDificuldadeSelecionado } as DificuldadeSessaoCompletaDto,
            descricao: descricao,
        } as PAYLOAD_DetalheRascunhoSessaoUnicaCanonicaEdicaoDto);
    };

    return (
        <ContextoEdicaoRascunhoSessaoUnicaCanonica.Provider value={{ idDificuldadeSelecionado, setIdDificuldadeSelecionada, idTipoSelecionado, setIdTipoSelecionada, descricao, setDescricao, podeSalvar, handleSalvar }}>
            {children}
        </ContextoEdicaoRascunhoSessaoUnicaCanonica.Provider>
    );
};