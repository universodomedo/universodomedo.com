'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useContextoRascunho } from 'Contextos/ContextoRascunho/contexto';
import { DetalheRascunhoSessaoUnicaDto, DificuldadeSessaoDto, NivelDto, RascunhoDto, TipoSessaoDto } from 'types-nora-api';

interface ContextoEdicaoRascunhoSessaoUnicaNaoCanonicaProps {
    seNumeroJogadoresTemLimiteMax: boolean;
    setSeNumeroJogadoresTemLimiteMax: (v: boolean) => void;
    numeroJogadoresMin: number;
    setNumeroJogadoresMin: (v: number) => void;
    numeroJogadoresMax: number;
    setNumeroJogadoresMax: (v: number) => void;
    idNivelSelecionado: number;
    setIdNivelSelecionado: (v: number) => void;
    idDificuldadeSelecionado: number;
    setIdDificuldadeSelecionada: (v: number) => void;
    idTipoSelecionado: number;
    setIdTipoSelecionada: (v: number) => void;
    descricao: Record<string, any> | null;
    setDescricao: (v: Record<string, any> | null) => void;
    podeSalvar: boolean;
    handleSalvar: () => void;
};

const ContextoEdicaoRascunhoSessaoUnicaNaoCanonica = createContext<ContextoEdicaoRascunhoSessaoUnicaNaoCanonicaProps | undefined>(undefined);

export const useContextoEdicaoRascunhoSessaoUnicaNaoCanonica = (): ContextoEdicaoRascunhoSessaoUnicaNaoCanonicaProps => {
    const context = useContext(ContextoEdicaoRascunhoSessaoUnicaNaoCanonica);
    if (!context) throw new Error('useContextoEdicaoRascunhoSessaoUnicaNaoCanonica precisa estar dentro de um ContextoEdicaoRascunhoSessaoUnicaNaoCanonica');
    return context;
};

export const ContextoEdicaoRascunhoSessaoUnicaNaoCanonicaProvider = ({ children }: { children: React.ReactNode }) => {
    const { salvaDetalhesRascunhoSessaoUnica, rascunho } = useContextoRascunho();

    const [seNumeroJogadoresTemLimiteMax, setSeNumeroJogadoresTemLimiteMax] = useState<boolean>(rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.numeroMaximoJogadores === null ? false : true : true);

    const [numeroJogadoresMin, setNumeroJogadoresMin] = useState<number>(rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.numeroMinimoJogadores : 1);
    const [numeroJogadoresMax, setNumeroJogadoresMax] = useState<number>(rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.numeroMaximoJogadores ? rascunho?.detalheRascunhoSessaoUnica.numeroMaximoJogadores : rascunho?.detalheRascunhoSessaoUnica.numeroMinimoJogadores : 1);

    useEffect(() => {
        if (numeroJogadoresMax && numeroJogadoresMax < numeroJogadoresMin) setNumeroJogadoresMax(numeroJogadoresMin);
    }, [numeroJogadoresMin]);

    const [idNivelSelecionado, setIdNivelSelecionado] = useState(rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.nivelPersonagem.id : 0);
    const [idDificuldadeSelecionado, setIdDificuldadeSelecionada] = useState(rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.dificuldadeSessao.id : 0);
    const [idTipoSelecionado, setIdTipoSelecionada] = useState(rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.tipoSessao.id : 0);
    const [descricao, setDescricao] = useState(rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.descricao : null);

    //

    const detalheInicial = {
        seNumeroJogadoresTemLimiteMax: rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.numeroMaximoJogadores !== null : true,
        numeroJogadoresMin: rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.numeroMinimoJogadores : 1,
        numeroJogadoresMax: rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.numeroMaximoJogadores ?? (rascunho?.detalheRascunhoSessaoUnica.numeroMinimoJogadores) : 1,
        idNivelSelecionado: rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.nivelPersonagem.id : 0,
        idDificuldadeSelecionado: rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.dificuldadeSessao.id : 0,
        idTipoSelecionado: rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.tipoSessao.id : 0,
        descricao: rascunho?.detalheRascunhoSessaoUnica ? rascunho?.detalheRascunhoSessaoUnica.descricao : null,
    };

    const houveModificacao =
        seNumeroJogadoresTemLimiteMax !== detalheInicial.seNumeroJogadoresTemLimiteMax ||
        numeroJogadoresMin !== detalheInicial.numeroJogadoresMin ||
        numeroJogadoresMax !== detalheInicial.numeroJogadoresMax ||
        idNivelSelecionado !== detalheInicial.idNivelSelecionado ||
        idDificuldadeSelecionado !== detalheInicial.idDificuldadeSelecionado ||
        idTipoSelecionado !== detalheInicial.idTipoSelecionado ||
        JSON.stringify(descricao) !== JSON.stringify(detalheInicial.descricao);

    //

    const podeSalvar: boolean = (idNivelSelecionado > 0 && idDificuldadeSelecionado > 0 && idTipoSelecionado > 0 && houveModificacao);

    const handleSalvar = () => {
        const alteracoes: string[] = [];

        if (numeroJogadoresMin !== detalheInicial.numeroJogadoresMin)
            alteracoes.push("Número mínimo de jogadores foi alterado");

        if (seNumeroJogadoresTemLimiteMax !== detalheInicial.seNumeroJogadoresTemLimiteMax || numeroJogadoresMax !== detalheInicial.numeroJogadoresMax)
            alteracoes.push("Número máximo de jogadores foi alterado");

        if (idNivelSelecionado !== detalheInicial.idNivelSelecionado)
            alteracoes.push("Nível dos personagens foi alterado");

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

        salvaDetalhesRascunhoSessaoUnica({
            rascunho: { id: rascunho?.id } as RascunhoDto,
            tipoSessao: { id: idTipoSelecionado } as TipoSessaoDto,
            dificuldadeSessao: { id: idDificuldadeSelecionado } as DificuldadeSessaoDto,
            nivelPersonagem: { id: idNivelSelecionado } as NivelDto,
            descricao: descricao,
            numeroMinimoJogadores: numeroJogadoresMin,
            numeroMaximoJogadores: seNumeroJogadoresTemLimiteMax ? numeroJogadoresMax : null,
        } as DetalheRascunhoSessaoUnicaDto);
    };

    return (
        <ContextoEdicaoRascunhoSessaoUnicaNaoCanonica.Provider value={{ seNumeroJogadoresTemLimiteMax, setSeNumeroJogadoresTemLimiteMax, numeroJogadoresMin, setNumeroJogadoresMin, numeroJogadoresMax, setNumeroJogadoresMax, idNivelSelecionado, setIdNivelSelecionado, idDificuldadeSelecionado, setIdDificuldadeSelecionada, idTipoSelecionado, setIdTipoSelecionada, descricao, setDescricao, podeSalvar, handleSalvar }}>
            {children}
        </ContextoEdicaoRascunhoSessaoUnicaNaoCanonica.Provider>
    );
};