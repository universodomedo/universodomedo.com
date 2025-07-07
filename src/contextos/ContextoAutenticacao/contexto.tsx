'use client';

import { createContext, useContext, useState } from 'react';
import { PaginaObjeto, UsuarioDto, VariavelAmbienteDto } from 'types-nora-api';
import { obtemObjetoAutenticacao } from "Uteis/ApiConsumer/ConsumerMiddleware";
import getValorVariavelAmbiente from 'Helpers/getValorVariavelAmbiente';

interface ContextoAutenticacaoProps {
    checkAuth: (paginaAtual?: PaginaObjeto | null) => Promise<void>;
    usuarioLogado: UsuarioDto | null;
    carregando: boolean;
    variaveisAmbiente: VariavelAmbienteDto[];
    numeroPendenciasPersonagem: number;
    estaAutenticado: boolean;
    ehMestre: boolean;
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
    const [numeroPendenciasPersonagem, setNumeroPendenciasPersonagem] = useState(0);
    const [carregando, setCarregando] = useState(true);

    const estaAutenticado = !carregando && !!usuarioLogado;
    const ehMestre = estaAutenticado && usuarioLogado?.perfilMestre.id > 1;
    const ehAdmin = estaAutenticado && usuarioLogado?.perfilAdmin.id === 2;

    const checkAuth = async (paginaAtual?: PaginaObjeto | null) => {
        try {
            const response = await obtemObjetoAutenticacao(paginaAtual);
            setUsuarioLogado(response.usuarioLogado);
            setVariaveisAmbiente(response.variaveisAmbiente);
            setNumeroPendenciasPersonagem(response.pendenciasDePersonagem);
        } catch (error) {
            setUsuarioLogado(null);
            setVariaveisAmbiente([]);
            setNumeroPendenciasPersonagem(0);
        } finally {
            setCarregando(false);
        }
    };

    if (!ehAdmin && getValorVariavelAmbiente(variaveisAmbiente, 'ESTADO_MANUTENCAO')) return (<h1>Estamos em manutenção, entre em contato com a Direção do Universo do Medo</h1>)

    return (
        <ContextoAutenticacao.Provider value={{ checkAuth, usuarioLogado, carregando, variaveisAmbiente, numeroPendenciasPersonagem, estaAutenticado, ehMestre, ehAdmin }}>
            {children}
        </ContextoAutenticacao.Provider>
    );
};