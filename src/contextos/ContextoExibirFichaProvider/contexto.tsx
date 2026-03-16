'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { J_DadosFichaEmJogo } from 'types-nora-api';

import { toast } from 'Hooks/useToast';
import { obtemJDadosFichaEmJogoPorIdFicha } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import ConteudoFichaDeJogo from "Componentes/ElementosDeJogo/ConteudoFichaDeJogo/ConteudoFichaDeJogo";

interface ContextoExibirFichaProps {
    J_fichaAtualizada: J_DadosFichaEmJogo;
};

const ContextoExibirFicha = createContext<ContextoExibirFichaProps | undefined>(undefined);

export const useContextoExibirFicha = (): ContextoExibirFichaProps => {
    const context = useContext(ContextoExibirFicha);
    if (!context) throw new Error('useContextoExibirFicha precisa estar dentro de um ContextoExibirFicha');
    return context;
};

export const ContextoExibirFichaProvider = ({ idFicha, desativarAcoes = false }: { idFicha: number; desativarAcoes?: boolean; }) => {
    const [J_fichaAtualizada, setJ_FichaAtualizada] = useState<J_DadosFichaEmJogo | null>(null);

    async function buscaFichasUsuario() {
        try {
            setJ_FichaAtualizada(await obtemJDadosFichaEmJogoPorIdFicha(idFicha));
        } catch {
            setJ_FichaAtualizada(null);
            toast.erro('Houve um problema ao carregar sua ficha');
        }
    };

    useEffect(() => {
        buscaFichasUsuario();
    }, []);

    if (J_fichaAtualizada === null) return <h2>Carregando Ficha...</h2>;
    
    return (
        <ContextoExibirFicha.Provider value={{ J_fichaAtualizada }}>
            <ConteudoFichaDeJogo JDadosFichaEmJogo={J_fichaAtualizada} desativarAcoes={desativarAcoes} />
        </ContextoExibirFicha.Provider>
    );
};