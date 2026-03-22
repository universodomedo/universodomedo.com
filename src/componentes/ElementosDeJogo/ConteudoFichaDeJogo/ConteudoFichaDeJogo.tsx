'use client';

import { useState } from "react";
import { J_DadosFichaEmJogo } from "types-nora-api";

import { ContextoFichaDePersonagemProvider } from "Contextos/ContextoFichaDePersonagem/contexto";
import combineProviders from 'Contextos/combineProviders';
import { ContextoControleAtributosPericiasProvider, useContextoControleAtributosPericias } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleAtributosPericias/contexto';
import PaginaControleAtributosPericias from './paginas/PaginaControleAtributosPericias/PaginaControleAtributosPericias';
import CarrosselConteudoFichaDeJogo from '../CarrosselConteudoFichaDeJogo/CarrosselConteudoFichaDeJogo';

export default function ConteudoFichaDeJogo({ JDadosFichaEmJogo, desativarAcoes }: { JDadosFichaEmJogo: J_DadosFichaEmJogo; desativarAcoes: boolean; }) {
    return (
        <ContextoFichaDePersonagemProvider JDadosFichaEmJogo={JDadosFichaEmJogo} desativarAcoes={desativarAcoes}>
            <ConteudoFichaDeJogo_Interno />
        </ContextoFichaDePersonagemProvider>
    );
};

function ConteudoFichaDeJogo_Interno() {
    const ProvidersControle = combineProviders(
        ContextoControleAtributosPericiasProvider,
    );

    return (
        <ProvidersControle>
            <ConteudoFichaDeJogo_ComContexto />
        </ProvidersControle>
    );
};

function ConteudoFichaDeJogo_ComContexto() {
    const listaPaginas = [
        {
            nome: 'Perícias',
            componente: <PaginaControleAtributosPericias />,
            contexto: useContextoControleAtributosPericias
        },
        {
            nome: 'Inventário',
            componente: <><h1>oi</h1></>,
            contexto: useContextoControleAtributosPericias
        },
        {
            nome: 'Habilidades',
            componente: <><h1>oi</h1></>,
            contexto: useContextoControleAtributosPericias
        },
        {
            nome: 'Registros',
            componente: <><h1>oi</h1></>,
            contexto: useContextoControleAtributosPericias
        },
    ];

    const [paginaAbertaSwiper, setPaginaAbertaSwiper] = useState(0);
    const paginaSelecionada = listaPaginas[paginaAbertaSwiper];

    return (
        <>
            <CarrosselConteudoFichaDeJogo listaPaginas={listaPaginas} setPaginaAbertaSwiper={setPaginaAbertaSwiper} paginaAbertaSwiper={paginaAbertaSwiper} />

            <hr style={{ width: '100%' }} />

            {paginaSelecionada.componente}
        </>
    );
};