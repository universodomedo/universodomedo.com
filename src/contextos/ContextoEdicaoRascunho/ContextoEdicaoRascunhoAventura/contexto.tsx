'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { useContextoRascunho } from 'Contextos/ContextoRascunho/contexto';
import { DetalheRascunhoAventuraDto, RascunhoDto } from 'types-nora-api';

interface ContextoEdicaoRascunhoAventuraProps {
    descricao: Record<string, any> | null;
    setDescricao: (v: Record<string, any> | null) => void;
    podeSalvar: boolean;
    handleSalvar: () => void;
};

const ContextoEdicaoRascunhoAventura = createContext<ContextoEdicaoRascunhoAventuraProps | undefined>(undefined);

export const useContextoEdicaoRascunhoAventura = (): ContextoEdicaoRascunhoAventuraProps => {
    const context = useContext(ContextoEdicaoRascunhoAventura);
    if (!context) throw new Error('useContextoEdicaoRascunhoAventura precisa estar dentro de um ContextoEdicaoRascunhoAventura');
    return context;
};

export const ContextoEdicaoRascunhoAventuraProvider = ({ children }: { children: React.ReactNode }) => {
    const { salvaDetalhesRascunhoAventura, rascunho } = useContextoRascunho();

    const [descricao, setDescricao] = useState(rascunho.detalheRascunhoSessaoUnicaCanonica ? rascunho.detalheRascunhoSessaoUnicaCanonica.descricao : null);

    //

    const detalheInicial = { descricao: rascunho.detalheRascunhoSessaoUnica ? rascunho.detalheRascunhoSessaoUnica.descricao : null };
    const houveModificacao = JSON.stringify(descricao) !== JSON.stringify(detalheInicial.descricao);

    //

    const podeSalvar: boolean = (houveModificacao);

    const handleSalvar = () => {
        const alteracoes: string[] = [];

        if (JSON.stringify(descricao) !== JSON.stringify(detalheInicial.descricao))
            alteracoes.push("Descrição foi alterada");

        if (alteracoes.length < 1) return;

        const confirmacao = window.confirm(
            "Tem certeza que deseja salvar as alterações?\n\n" +
            alteracoes.map(a => `• ${a}`).join("\n")
        );

        if (!confirmacao) return;

        salvaDetalhesRascunhoAventura({
            rascunho: { id: rascunho.id } as RascunhoDto,
            descricao: descricao,
        } as DetalheRascunhoAventuraDto);
    };

    return (
        <ContextoEdicaoRascunhoAventura.Provider value={{ descricao, setDescricao, podeSalvar, handleSalvar }}>
            {children}
        </ContextoEdicaoRascunhoAventura.Provider>
    );
};