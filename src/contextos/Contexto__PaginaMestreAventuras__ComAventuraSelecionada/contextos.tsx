'use client';

import { createContext, useContext } from 'react';

import RenderizaConsultaNoraGraphQL from 'Helpers/RenderizaConsultaNoraGraphQL/RenderizaConsultaNoraGraphQL';
import { useContexto__PaginaMestreAventuras } from '../Contexto__PaginaMestreAventuras/contexto';
import SPA__PaginaMestreAventuras__ComAventuraSelecionada from 'Conteineres/PaginaMestreAventuras/paginas/SPA__PaginaMestreAventuras__ComAventuraSelecionada/SPA__PaginaMestreAventuras__ComAventuraSelecionada';
import { GrupoAventuraSelecionado, useConsultaGrupoAventuraSelecionada } from './consultaGraphQL';

type Contexto__PaginaMestreAventuras__Props = ReturnType<typeof useContexto__PaginaMestreAventuras>;

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
    const consultaGrupoAventuraSelecionado = useConsultaGrupoAventuraSelecionada({ idGrupoAventuraSelecionado });

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