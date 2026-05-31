'use client';

import { createContext, useContext, useState } from 'react';
import type { VIEW_TipoSerInatoConsolidadoDto } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { defineTipoSerAtivo, obtemTipoSerInatoConsolidado } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';
import SPA__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres from 'Conteineres/PaginaModeradorConfiguracaoSeresInatos/paginas/SPA__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres/SPA__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres';
import { useListagemTiposSeres, type RegistroTipoSer } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/listagens';

interface Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres__Props {
    iniciaNovoTipoSer: () => void;
    editaTipoSer: (tipoSer: RegistroTipoSer) => void;
};

interface Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres__Valor extends Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres__Props {
    listagemTiposSeres: ReturnType<typeof useListagemTiposSeres>;
    tipoSerConsolidado: VIEW_TipoSerInatoConsolidadoDto | null;
    alternaAtivoTipoSer: (tipoSer: RegistroTipoSer) => Promise<void>;
    visualizaTipoSer: (tipoSer: RegistroTipoSer) => Promise<void>;
};

const Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres = createContext<Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres__Valor | undefined>(undefined);

export const useContexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres = (): Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres__Valor => {
    const context = useContext(Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres);
    if (!context) throw new Error('useContexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres precisa estar dentro de um Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres');
    return context;
};

export const Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres__Provider = (props: Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: 'Tipos de Ser', fecharProps: undefined });

    const [tipoSerConsolidado, setTipoSerConsolidado] = useState<VIEW_TipoSerInatoConsolidadoDto | null>(null);
    const listagemTiposSeres = useListagemTiposSeres();

    async function alternaAtivoTipoSer(tipoSer: RegistroTipoSer): Promise<void> {
        try {
            await defineTipoSerAtivo(tipoSer.id, !tipoSer.ativo);
            listagemTiposSeres.recarregar();
            await toast.sucesso(tipoSer.ativo ? 'Tipo de ser desativado' : 'Tipo de ser reativado', tipoSer.nome);
        } catch {
            await toast.erro('Falha ao alterar tipo de ser', 'A operação não foi concluída.');
        }
    };

    async function visualizaTipoSer(tipoSer: RegistroTipoSer): Promise<void> {
        try {
            setTipoSerConsolidado(await obtemTipoSerInatoConsolidado(tipoSer.id));
        } catch {
            await toast.erro('Falha ao consolidar tipo de ser', 'A visualização consolidada não foi carregada.');
        }
    };

    return (
        <Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres.Provider value={{ ...props, listagemTiposSeres, tipoSerConsolidado, alternaAtivoTipoSer, visualizaTipoSer }}>
            <SPA__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres />
        </Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres.Provider>
    );
};