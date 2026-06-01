'use client';

import { createContext, useCallback, useContext } from 'react';

import { type ConfiguracaoArteCapa } from '@/contextos/Contexto__Modal__ConfiguradorArteCapa/contexto';
import { Contexto__PaginaPerfilUsuario__Provider } from '@/contextos/Contexto__PaginaPerfilUsuario/contexto';
import { useContextoAutenticacao } from '../ContextoAutenticacao/contexto';
import { me_atualizaArteCapaPerfilUsuario } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from '@/hooks/useToast';

interface Contexto__PaginaMinhaPagina__Props {
    configArteCapa: ConfiguracaoArteCapa;
};

export const Contexto__PaginaMinhaPagina = createContext<Contexto__PaginaMinhaPagina__Props | undefined>(undefined);

export const useContexto__PaginaMinhaPagina = (): Contexto__PaginaMinhaPagina__Props => {
    const context = useContext(Contexto__PaginaMinhaPagina);
    if (!context) throw new Error('useContexto__PaginaMinhaPagina precisa estar dentro de um Contexto__PaginaMinhaPagina');
    return context;
};

export const Contexto__PaginaMinhaPagina__Provider = ({ children }: { children: React.ReactNode; }) => {
    const { usuarioLogado } = useContextoAutenticacao();

    const atualizarCapaPerfilUsuario = useCallback(async (idArquivoTipadoArte: number) => {
        try {
            await me_atualizaArteCapaPerfilUsuario(idArquivoTipadoArte);
            toast.sucesso('Capa atualizada', 'Capa atualizada com sucesso!', { recarregaPagina: true });
        } catch {
            toast.erro('Erro ao atualizar capa', 'Não foi possível atualizar a capa.');
        }
    }, []);

    if (!usuarioLogado) return;

    const configArteCapa: ConfiguracaoArteCapa = { tituloOperacao: 'Configurando Capa de Perfil', subtituloOperacao: usuarioLogado.username, callback: atualizarCapaPerfilUsuario };

    return (
        <Contexto__PaginaPerfilUsuario__Provider idUsuario={usuarioLogado.id}>
            <Contexto__PaginaMinhaPagina.Provider value={{ configArteCapa }}>
                {children}
            </Contexto__PaginaMinhaPagina.Provider>
        </Contexto__PaginaPerfilUsuario__Provider>
    );
};