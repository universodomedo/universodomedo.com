'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { defineAcaoInataAtiva } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';
import SPA__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes from 'Conteineres/PaginaModeradorConfiguracaoSeresInatos/paginas/SPA__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes/SPA__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes';
import { useListagemAcoesInatas, type RegistroAcaoInata } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/listagens';

interface Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes__Props {
    iniciaNovaAcao: () => void;
    editaAcao: (acao: RegistroAcaoInata) => void;
};

interface Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes__Valor extends Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes__Props {
    listagemAcoes: ReturnType<typeof useListagemAcoesInatas>;
    alternaAtivoAcao: (acao: RegistroAcaoInata) => Promise<void>;
};

const Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes = createContext<Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes__Valor | undefined>(undefined);

export const useContexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes = (): Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes__Valor => {
    const context = useContext(Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes);
    if (!context) throw new Error('useContexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes precisa estar dentro de um Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes');
    return context;
};

export const Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes__Provider = (props: Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Ações Inatas', fecharProps: undefined });

    const listagemAcoes = useListagemAcoesInatas();

    async function alternaAtivoAcao(acao: RegistroAcaoInata): Promise<void> {
        try {
            await defineAcaoInataAtiva(acao.id, !acao.ativo);
            listagemAcoes.recarregar();
            await toast.sucesso(acao.ativo ? 'Ação inata desativada' : 'Ação inata reativada', acao.nome);
        } catch {
            await toast.erro('Falha ao alterar ação inata', 'A operação não foi concluída.');
        }
    };

    return (
        <Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes.Provider value={{ ...props, listagemAcoes, alternaAtivoAcao }}>
            <SPA__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes />
        </Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes.Provider>
    );
};