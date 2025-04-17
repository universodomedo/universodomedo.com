'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { UsuarioDto, VariavelAmbienteDto } from 'types-nora-api';
import { obtemObjetoAutenticacao } from "Uteis/ApiConsumer/ConsumerMiddleware";
import getValorVariavelAmbiente from 'Helpers/getValorVariavelAmbiente';

interface ContextoAutenticacaoProps {
    usuarioLogado: UsuarioDto | null;
    carregando: boolean;
    variaveisAmbiente: VariavelAmbienteDto[];
    estaAutenticado: boolean;
    ehAdmin: boolean;
};

const ContextoAutenticacao = createContext<ContextoAutenticacaoProps | undefined>(undefined);

export const useContextoAutenticacao = (): ContextoAutenticacaoProps => {
    const context = useContext(ContextoAutenticacao);
    if (!context) throw new Error('useContextoAutenticacao precisa estar dentro de um ContextoAutenticacao');
    return context;
};

export const ContextoAutenticacaoProvider = ({ children }: { children: React.ReactNode }) => {
    const [usuarioLogado, setUsuarioLogado] = useState<UsuarioDto | null>(null);
    const [variaveisAmbiente, setVariaveisAmbiente] = useState<VariavelAmbienteDto[]>([]);
    const [carregando, setCarregando] = useState(true);

    const estaAutenticado = !carregando && !!usuarioLogado;
    const ehAdmin = estaAutenticado && usuarioLogado?.perfilAdmin.id === 2;

    const checkAuth = async () => {
        try {
            const response = await obtemObjetoAutenticacao();
            setUsuarioLogado(response.usuarioLogado);
            setVariaveisAmbiente(response.variaveisAmbiente);
        } catch (error) {
            setUsuarioLogado(null);
            setVariaveisAmbiente([]);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    if (!ehAdmin && getValorVariavelAmbiente(variaveisAmbiente, 'ESTADO_MANUTENCAO')) return (<h1>Estamos em manutenção, entre em contato com a Direção do Universo do Medo</h1>)

    return (
        <ContextoAutenticacao.Provider value={{ usuarioLogado, carregando, variaveisAmbiente, estaAutenticado, ehAdmin }}>
            {children}
        </ContextoAutenticacao.Provider>
    );
};