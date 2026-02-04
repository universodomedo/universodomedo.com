import React from 'react';

import { useContextoPaginaMestreSessao } from 'Contextos/ContextoMestreSessao/contexto';
import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo";

export function ListaInfracoesSessao() {
    const { sessaoSelecionada } = useContextoPaginaMestreSessao();

    return (
        <SecaoDeConteudo>
            <></>
        </SecaoDeConteudo>
    );
};