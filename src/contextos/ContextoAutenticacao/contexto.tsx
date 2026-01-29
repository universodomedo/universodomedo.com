'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { type CapacidadeDef, CAPACIDADES, type PaginaTemplate, type UsuarioDto, type VariavelAmbienteDto } from 'types-nora-api';

import { obtemObjetoAutenticacao } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import getValorVariavelAmbiente from 'Helpers/getValorVariavelAmbiente';

function dbgAuth(msg: string, extra?: any) {
    if (typeof window === "undefined") return;
    // console.log(`[AUTH] ${new Date().toISOString()} ${msg}`, extra ?? "");
}

interface ContextoAutenticacaoProps {
    checkAuth: (paginaAtualTemplate?: PaginaTemplate | null) => Promise<void>;
    usuarioLogado: UsuarioDto | null;
    carregando: boolean;
    variaveisAmbiente: VariavelAmbienteDto[];
    numeroPendenciasPersonagem: number;
    estaAutenticado: boolean;
    verificarCapacidade: (capacidade: CapacidadeDef) => boolean;
    cadastroPermitido: boolean;
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
    const [capacidadesConcedidas, setCapacidadesConcedidas] = useState<Record<string, true>>({} as Record<string, true>);
    const [carregando, setCarregando] = useState(true);
    const [cadastroPermitido, setCadastroPermitido] = useState(false);

    const estaAutenticado = !carregando && !!usuarioLogado;

    useEffect(() => { dbgAuth(`STATE carregando=${carregando} estaAutenticado=${estaAutenticado} usuarioLogado=${usuarioLogado?.id ?? "null"}`); }, [carregando, estaAutenticado, usuarioLogado]);

    const checkAuth = async (paginaAtualTemplate?: PaginaTemplate | null) => {
        dbgAuth(`checkAuth START`, { paginaAtualTemplate: paginaAtualTemplate ?? null });

        try {
            const response = await obtemObjetoAutenticacao(paginaAtualTemplate ?? undefined);
            dbgAuth(`checkAuth OK`, { usuarioId: response?.usuarioLogado?.id ?? null });
            setUsuarioLogado(response.usuarioLogado);
            setVariaveisAmbiente(response.variaveisAmbiente);
            setCapacidadesConcedidas((response.capacidadesConcedidas ?? {}) as Record<string, true>);
            setNumeroPendenciasPersonagem(response.pendenciasDePersonagem);
            setCadastroPermitido(response.cadastroPermitido === true);
        } catch (_error) {
            dbgAuth(`checkAuth ERROR`, _error);
            setUsuarioLogado(null);
            setVariaveisAmbiente([]);
            setCapacidadesConcedidas({} as Record<number, true>);
            setNumeroPendenciasPersonagem(0);
            setCadastroPermitido(false);
        } finally {
            dbgAuth(`checkAuth FINALLY -> setCarregando(false)`);
            setCarregando(false);
        }
    };

    const verificarCapacidade = (capacidade: CapacidadeDef): boolean => !carregando && !!usuarioLogado && (capacidadesConcedidas[CAPACIDADES.ADMINISTRADOR__SUDO__BURLAR_CAPACIDADES.nome] === true || capacidadesConcedidas[capacidade.nome] === true);

    if (getValorVariavelAmbiente(variaveisAmbiente, 'ESTADO_MANUTENCAO') && !verificarCapacidade(CAPACIDADES.ADMINISTRADOR__SUDO__BURLAR_MODO_MANUTENÇÃO)) return (<h1>Estamos em manutenção, entre em contato com a Direção do Universo do Medo</h1>);

    return (
        <ContextoAutenticacao.Provider value={{ checkAuth, usuarioLogado, carregando, variaveisAmbiente, numeroPendenciasPersonagem, estaAutenticado, verificarCapacidade, cadastroPermitido }}>
            {children}
        </ContextoAutenticacao.Provider>
    );
};