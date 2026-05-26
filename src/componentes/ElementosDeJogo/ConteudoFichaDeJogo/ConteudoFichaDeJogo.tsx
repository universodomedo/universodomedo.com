'use client';

import { useState } from "react";
import { J_DadosFichaEmJogo } from "types-nora-api";

import { ContextoFichaDePersonagemProvider } from "Contextos/ContextoFichaDePersonagem/contexto";
import combineProviders from 'Contextos/combineProviders';
import { ContextoControleAtributosPericiasProvider, useContextoControleAtributosPericias } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleAtributosPericias/contexto';
import PaginaControleAtributosPericias from './paginas/PaginaControleAtributosPericias/PaginaControleAtributosPericias';
import PaginaControleHabilidades from './paginas/PaginaControleHabilidades/PaginaControleHabilidades';
import PaginaControleModificadores from './paginas/PaginaControleModificadores/PaginaControleModificadores';
import CarrosselConteudoFichaDeJogo from '../CarrosselConteudoFichaDeJogo/CarrosselConteudoFichaDeJogo';

export default function ConteudoFichaDeJogo({ JDadosFichaEmJogo, desativarAcoes, exibirHabilidadesRuntime = false, exibirModificadoresRuntime = false }: { JDadosFichaEmJogo: J_DadosFichaEmJogo; desativarAcoes: boolean; exibirHabilidadesRuntime?: boolean; exibirModificadoresRuntime?: boolean; }) {
    return (
        <ContextoFichaDePersonagemProvider JDadosFichaEmJogo={JDadosFichaEmJogo} desativarAcoes={desativarAcoes}>
            <ConteudoFichaDeJogo_Interno exibirHabilidadesRuntime={exibirHabilidadesRuntime} exibirModificadoresRuntime={exibirModificadoresRuntime} />
        </ContextoFichaDePersonagemProvider>
    );
};

function ConteudoFichaDeJogo_Interno({ exibirHabilidadesRuntime, exibirModificadoresRuntime }: { exibirHabilidadesRuntime: boolean; exibirModificadoresRuntime: boolean; }) {
    const ProvidersControle = combineProviders(
        ContextoControleAtributosPericiasProvider,
    );

    return (
        <ProvidersControle>
            <ConteudoFichaDeJogo_ComContexto exibirHabilidadesRuntime={exibirHabilidadesRuntime} exibirModificadoresRuntime={exibirModificadoresRuntime} />
        </ProvidersControle>
    );
};

function ConteudoFichaDeJogo_ComContexto({ exibirHabilidadesRuntime, exibirModificadoresRuntime }: { exibirHabilidadesRuntime: boolean; exibirModificadoresRuntime: boolean; }) {
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
            componente: exibirHabilidadesRuntime ? <PaginaControleHabilidades /> : <><h1>oi</h1></>,
            contexto: exibirHabilidadesRuntime ? obtemMenuVazioHabilidadesRuntime : useContextoControleAtributosPericias
        },
        ...(exibirModificadoresRuntime ? [{
            nome: 'Modificadores',
            componente: <PaginaControleModificadores />,
            contexto: obtemMenuVazioModificadoresRuntime
        }] : []),
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

function obtemMenuVazioHabilidadesRuntime() { return { listaMenus: [] }; };
function obtemMenuVazioModificadoresRuntime() { return { listaMenus: [] }; };
