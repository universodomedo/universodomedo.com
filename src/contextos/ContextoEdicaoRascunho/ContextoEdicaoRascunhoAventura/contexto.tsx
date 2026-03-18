'use client';

import { createContext, useContext, useState } from 'react';

import { useContextoRascunho } from 'Contextos/ContextoRascunho/contexto';
import { PAYLOAD_DetalheRascunhoAventuraEdicaoDto, RascunhoAventuraCompletaDto } from 'types-nora-api';

interface ContextoEdicaoRascunhoAventuraProps {
    descricao: Record<string, any> | null;
    setDescricao: (v: Record<string, any>) => void;
    podeSalvar: boolean;
    handleSalvar: () => void;
};

const ContextoEdicaoRascunhoAventura = createContext<ContextoEdicaoRascunhoAventuraProps | undefined>(undefined);

export const useContextoEdicaoRascunhoAventura = (): ContextoEdicaoRascunhoAventuraProps => {
    const context = useContext(ContextoEdicaoRascunhoAventura);
    if (!context) throw new Error('useContextoEdicaoRascunhoAventura precisa estar dentro de um ContextoEdicaoRascunhoAventura');
    return context;
};

export const ContextoEdicaoRascunhoAventuraProvider = ({ children, rascunho }: { children: React.ReactNode; rascunho: RascunhoAventuraCompletaDto; }) => {
    const { salvaDetalhesRascunho } = useContextoRascunho();

    const [descricao, setDescricao] = useState<Record<string, any>>(rascunho.detalheRascunho ? rascunho.detalheRascunho.descricao : {});

    const detalheInicial = { descricao: rascunho.detalheRascunho ? rascunho.detalheRascunho.descricao : {} };
    const houveModificacao = JSON.stringify(descricao) !== JSON.stringify(detalheInicial.descricao);

    const podeSalvar: boolean = houveModificacao;

    const handleSalvar = () => {
        const alteracoes: string[] = [];

        if (JSON.stringify(descricao) !== JSON.stringify(detalheInicial.descricao)) alteracoes.push('Descrição foi alterada');

        if (alteracoes.length < 1) return;

        const confirmacao = window.confirm(
            'Tem certeza que deseja salvar as alterações?\n\n' +
            alteracoes.map(a => `• ${a}`).join('\n')
        );

        if (!confirmacao) return;

        salvaDetalhesRascunho({
            fkRascunhoId: rascunho.id,
            descricao: descricao,
        });
    };

    return (
        <ContextoEdicaoRascunhoAventura.Provider value={{ descricao, setDescricao, podeSalvar, handleSalvar }}>
            {children}
        </ContextoEdicaoRascunhoAventura.Provider>
    );
};