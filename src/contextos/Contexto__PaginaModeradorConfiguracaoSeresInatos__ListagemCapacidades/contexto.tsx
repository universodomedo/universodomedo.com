'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { defineCapacidadeInataAtiva } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';
import SPA__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades from 'Conteineres/PaginaModeradorConfiguracaoSeresInatos/paginas/SPA__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades/SPA__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades';
import { useListagemCapacidadesInatas, type RegistroCapacidadeInata } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/listagens';

interface Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades__Props {
    iniciaNovaCapacidade: () => void;
    editaCapacidade: (capacidade: RegistroCapacidadeInata) => void;
};

interface Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades__Valor extends Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades__Props {
    listagemCapacidades: ReturnType<typeof useListagemCapacidadesInatas>;
    alternaAtivoCapacidade: (capacidade: RegistroCapacidadeInata) => Promise<void>;
};

const Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades = createContext<Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades__Valor | undefined>(undefined);

export const useContexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades = (): Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades__Valor => {
    const context = useContext(Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades);
    if (!context) throw new Error('useContexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades precisa estar dentro de um Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades');
    return context;
};

export const Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades__Provider = (props: Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Capacidades Inatas', fecharProps: undefined });

    const listagemCapacidades = useListagemCapacidadesInatas();

    async function alternaAtivoCapacidade(capacidade: RegistroCapacidadeInata): Promise<void> {
        try {
            await defineCapacidadeInataAtiva(capacidade.id, !capacidade.ativo);
            listagemCapacidades.recarregar();
            await toast.sucesso(capacidade.ativo ? 'Capacidade inata desativada' : 'Capacidade inata reativada', capacidade.nome);
        } catch {
            await toast.erro('Falha ao alterar capacidade inata', 'A operação não foi concluída.');
        }
    };

    return (
        <Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades.Provider value={{ ...props, listagemCapacidades, alternaAtivoCapacidade }}>
            <SPA__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades />
        </Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades.Provider>
    );
};