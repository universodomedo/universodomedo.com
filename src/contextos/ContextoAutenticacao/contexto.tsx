'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { CapacidadeDef, CAPACIDADES, UsuarioParaObjetoAutenticacaoDto, type PaginaTemplate, type VariavelAmbienteCompletaDto } from 'types-nora-api';

import { obtemObjetoAutenticacao } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import getValorVariavelAmbiente from 'Helpers/getValorVariavelAmbiente';

function dbgAuth(msg: string, extra?: unknown) {
    if (typeof window === 'undefined') return;
    // console.log(`[AUTH] ${new Date().toISOString()} ${msg}`, extra ?? '');
}

type CapacidadeNome = CapacidadeDef['nome'];

interface ContextoAutenticacaoProps {
    checkAuth: (paginaAtualTemplate?: PaginaTemplate | null) => Promise<void>;
    usuarioLogado: UsuarioParaObjetoAutenticacaoDto | null;
    carregando: boolean;
    variaveisAmbiente: VariavelAmbienteCompletaDto[];
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
    const [usuarioLogado, setUsuarioLogado] = useState<UsuarioParaObjetoAutenticacaoDto | null>(null);
    const [variaveisAmbiente, setVariaveisAmbiente] = useState<VariavelAmbienteCompletaDto[]>([]);
    const [capacidadesConcedidas, setCapacidadesConcedidas] = useState<Partial<Record<CapacidadeNome, true>>>({});
    const [carregando, setCarregando] = useState(true);
    const [cadastroPermitido, setCadastroPermitido] = useState(false);

    const [paginaAtualTemplate, setPaginaAtualTemplate] = useState<PaginaTemplate | null>(null);

    const estaAutenticado = !carregando && !!usuarioLogado;

    useEffect(() => { dbgAuth(`STATE carregando=${carregando} estaAutenticado=${estaAutenticado} usuarioLogado=${usuarioLogado?.id ?? 'null'}`); }, [carregando, estaAutenticado, usuarioLogado]);

    const checkAuth = async (paginaAtualTemplate?: PaginaTemplate | null) => {
        dbgAuth('checkAuth START', { paginaAtualTemplate: paginaAtualTemplate ?? null });
        setPaginaAtualTemplate(paginaAtualTemplate ?? null);

        try {
            const response = await obtemObjetoAutenticacao();
            dbgAuth('checkAuth OK', { usuarioId: response?.usuarioLogado?.id ?? null });

            setUsuarioLogado(response.usuarioLogado);
            setVariaveisAmbiente(response.variaveisAmbiente);
            setCapacidadesConcedidas((response.capacidadesConcedidas ?? {}) as Partial<Record<CapacidadeNome, true>>);
            setCadastroPermitido(response.cadastroPermitido === true);
        } catch (_error) {
            dbgAuth('checkAuth ERROR', _error);

            setUsuarioLogado(null);
            setVariaveisAmbiente([]);
            setCapacidadesConcedidas({});
            setCadastroPermitido(false);
        } finally {
            dbgAuth('checkAuth FINALLY -> setCarregando(false)');
            setCarregando(false);
        }
    };

    useEffect(() => { void checkAuth(); }, []);

    const verificarCapacidade = (capacidade: CapacidadeDef): boolean => !carregando && !!usuarioLogado && (capacidadesConcedidas[CAPACIDADES.ADMINISTRADOR__SUDO__BURLAR_CAPACIDADES.nome] === true || capacidadesConcedidas[capacidade.nome] === true);

    // depois tem que verificar pela pagina acessada (objeto de PAGINAS)
    if ((paginaAtualTemplate !== '/' && paginaAtualTemplate !== '/acessar') && getValorVariavelAmbiente(variaveisAmbiente, 'ESTADO_MANUTENCAO') && !verificarCapacidade(CAPACIDADES.ADMINISTRADOR__SUDO__BURLAR_MODO_MANUTENÇÃO)) return (<h1>Estamos em manutenção, entre em contato com a Direção do Universo do Medo</h1>);

    return (
        <ContextoAutenticacao.Provider value={{ checkAuth, usuarioLogado, carregando, variaveisAmbiente, estaAutenticado, verificarCapacidade, cadastroPermitido }}>
            {children}
        </ContextoAutenticacao.Provider>
    );
};
