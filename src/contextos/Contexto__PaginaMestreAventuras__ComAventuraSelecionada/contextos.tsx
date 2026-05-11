'use client';

import { createContext, useContext } from 'react';
import { GraphqlTypesGrupoAventura } from 'types-nora-api';

import RenderizaConsultaNoraGraphQL from 'Helpers/RenderizaConsultaNoraGraphQL/RenderizaConsultaNoraGraphQL';
import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';
import { useContexto__PaginaMestreAventuras } from '../Contexto__PaginaMestreAventuras/contexto';
import SPA__PaginaMestreAventuras__ComAventuraSelecionada from 'Conteineres/PaginaMestreAventuras/paginas/SPA__PaginaMestreAventuras__ComAventuraSelecionada/SPA__PaginaMestreAventuras__ComAventuraSelecionada';

type Contexto__PaginaMestreAventuras__Props = ReturnType<typeof useContexto__PaginaMestreAventuras>;

type GrupoAventuraSelecionado = NonNullable<ReturnType<typeof obtemConsultaGrupoAventuraSelecionado>['data']>;

interface Contexto__PaginaMestreAventuras__ComAventuraSelecionada__Props {
    grupoAventuraSelecionado: GrupoAventuraSelecionado;
    deselecionaGrupoAventura: Contexto__PaginaMestreAventuras__Props['deselecionaGrupoAventura'];
};

const Contexto__PaginaMestreAventuras__ComAventuraSelecionada = createContext<Contexto__PaginaMestreAventuras__ComAventuraSelecionada__Props | undefined>(undefined);

export const useContexto__PaginaMestreAventuras__ComAventuraSelecionada = (): Contexto__PaginaMestreAventuras__ComAventuraSelecionada__Props => {
    const context = useContext(Contexto__PaginaMestreAventuras__ComAventuraSelecionada);
    if (!context) throw new Error('useContexto__PaginaMestreAventuras__ComAventuraSelecionada precisa estar dentro de um Contexto__PaginaMestreAventuras__ComAventuraSelecionada');
    return context;
};

export const Contexto__PaginaMestreAventuras__ComAventuraSelecionada__Provider = ({ idGrupoAventuraSelecionado, deselecionaGrupoAventura }: { idGrupoAventuraSelecionado: number; deselecionaGrupoAventura: Contexto__PaginaMestreAventuras__Props['deselecionaGrupoAventura']; }) => {
    const consultaGrupoAventuraSelecionado = obtemConsultaGrupoAventuraSelecionado({ idGrupoAventuraSelecionado });

    return (
        <RenderizaConsultaNoraGraphQL consulta={consultaGrupoAventuraSelecionado} mensagemRegistroNaoEncontrado="Registro não encontrado.">
            {grupoAventuraSelecionado => (
                <Contexto__PaginaMestreAventuras__ComAventuraSelecionada.Provider value={{ grupoAventuraSelecionado, deselecionaGrupoAventura }}>
                    <SPA__PaginaMestreAventuras__ComAventuraSelecionada />
                </Contexto__PaginaMestreAventuras__ComAventuraSelecionada.Provider>
            )}
        </RenderizaConsultaNoraGraphQL>
    );
};

//

function obtemConsultaGrupoAventuraSelecionado(params: { idGrupoAventuraSelecionado: number; }) {
    return useNoraGraphQLRegistro('GrupoAventura', {
        select: ['id', 'nome', 'nomeUnicoGrupoAventura', 'dadosArteCapa', 'detalhesSessoes'],
        props: params,
        carregando: 'Buscando Aventura',
        mensagemErro: 'Houve um erro recuperando a Aventura selecionada',
        carregamento: 'BLOQUEIA_INTERFACE',
        montaParametrosConsulta: props => ({
            where: { id: { eq: props.idGrupoAventuraSelecionado } },
        }),
    });
};