'use client';

import { createContext, useCallback, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { useContexto__PaginaMestreAventuras } from '../Contexto__PaginaMestreAventuras/contexto';
import SPA__PaginaMestreAventuras__ComAventuraSelecionada from 'Conteineres/PaginaMestreAventuras/paginas/SPA__PaginaMestreAventuras__ComAventuraSelecionada/SPA__PaginaMestreAventuras__ComAventuraSelecionada';
import { configuraArteCapaGrupoAventura } from 'Uteis/ApiConsumer/ConsumerMiddleware';

type Contexto__PaginaMestreAventuras__Props = ReturnType<typeof useContexto__PaginaMestreAventuras>;

interface Contexto__PaginaMestreAventuras__ComAventuraSelecionada__Props {
    grupoAventura: NonNullable<Contexto__PaginaMestreAventuras__Props['grupoAventuraSelecionado']>;
    configuraArteCapaGrupoAventuraSelecionado: (idArquivoTipadoArte: number) => Promise<void>;
};

const Contexto__PaginaMestreAventuras__ComAventuraSelecionada = createContext<Contexto__PaginaMestreAventuras__ComAventuraSelecionada__Props | undefined>(undefined);

export const useContexto__PaginaMestreAventuras__ComAventuraSelecionada = (): Contexto__PaginaMestreAventuras__ComAventuraSelecionada__Props => {
    const context = useContext(Contexto__PaginaMestreAventuras__ComAventuraSelecionada);
    if (!context) throw new Error('useContexto__PaginaMestreAventuras__ComAventuraSelecionada precisa estar dentro de um Contexto__PaginaMestreAventuras__ComAventuraSelecionada');
    return context;
};

export const Contexto__PaginaMestreAventuras__ComAventuraSelecionada__Provider = ({ grupoAventura, deselecionaGrupoAventura }: { grupoAventura: NonNullable<Contexto__PaginaMestreAventuras__Props['grupoAventuraSelecionado']>; deselecionaGrupoAventura: Contexto__PaginaMestreAventuras__Props['deselecionaGrupoAventura']; }) => {
    useConfigurarLayoutContextualizado({ titulo: grupoAventura.nomeUnicoGrupoAventura, fecharProps: { tipo: 'acao', executar: () => { deselecionaGrupoAventura() }, tituloTooltip: 'Voltar' } }, 'patch');

    const configuraArteCapaGrupoAventuraSelecionado = useCallback(async (idArteCapa: number) => {
        await configuraArteCapaGrupoAventura(grupoAventura.id, idArteCapa);
    }, [grupoAventura.id]);

    return (
        <Contexto__PaginaMestreAventuras__ComAventuraSelecionada.Provider value={{ grupoAventura, configuraArteCapaGrupoAventuraSelecionado }}>
            <SPA__PaginaMestreAventuras__ComAventuraSelecionada />
        </Contexto__PaginaMestreAventuras__ComAventuraSelecionada.Provider>
    );
};