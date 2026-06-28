'use client';

import { useEffect } from "react";
import { J_DadosFichaEmJogo, type CodigoRecuperarFichaRuntime, type EstadoTemporalSalaDeJogoRuntime, type SalaDeJogo_Codigo } from "types-nora-api";

import { ContextoFichaDePersonagemProvider, useContextoFichaDePersonagem } from "Contextos/ContextoFichaDePersonagem/contexto";
import combineProviders from 'Contextos/combineProviders';
import { ContextoControleAtributosPericiasProvider, useContextoControleAtributosPericias } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleAtributosPericias/contexto';
import { ContextoControleAcoesRuntimeProvider, ContextoControleAcoesRuntimeSomenteLeituraProvider } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleAcoesRuntime/contexto';
import { ContextoControleTestesPericiaRuntimeProvider, ContextoControleTestesPericiaRuntimeSomenteLeituraProvider } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleTestesPericiaRuntime/contexto';
import { ContextoControleNavegacaoFichaProvider, useContextoControleNavegacaoFicha } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleNavegacaoFicha/contexto';
import PaginaControleAtributosPericias from './paginas/PaginaControleAtributosPericias/PaginaControleAtributosPericias';
import PaginaControleAcoes from './paginas/PaginaControleAcoes/PaginaControleAcoes';
import PaginaControleInventario from './paginas/PaginaControleInventario/PaginaControleInventario';
import PaginaControleHabilidades from './paginas/PaginaControleHabilidades/PaginaControleHabilidades';
import PaginaControleModificadores from './paginas/PaginaControleModificadores/PaginaControleModificadores';
import PaginaControleRecursos from './paginas/PaginaControleRecursos/PaginaControleRecursos';
import CarrosselConteudoFichaDeJogo from '../CarrosselConteudoFichaDeJogo/CarrosselConteudoFichaDeJogo';
import JanelaDeMensagensDeJogo from '../JanelaDeMensagensDeJogo/JanelaDeMensagensDeJogo';

const ProvidersControleFicha = combineProviders(
    ContextoControleAtributosPericiasProvider,
);

export default function ConteudoFichaDeJogo({ JDadosFichaEmJogo, desativarAcoes, exibirHabilidadesRuntime = false, exibirAcoesRuntime = false, exibirModificadoresRuntime = false, codigoRecuperarFichaRuntime, codigoSala, estadoTemporalSalaJogo }: { JDadosFichaEmJogo: J_DadosFichaEmJogo; desativarAcoes: boolean; exibirHabilidadesRuntime?: boolean; exibirAcoesRuntime?: boolean; exibirModificadoresRuntime?: boolean; codigoRecuperarFichaRuntime?: CodigoRecuperarFichaRuntime; codigoSala?: SalaDeJogo_Codigo; estadoTemporalSalaJogo?: EstadoTemporalSalaDeJogoRuntime | null; }) {
    return (
        <ContextoControleNavegacaoFichaProvider>
            <ContextoFichaDePersonagemProvider JDadosFichaEmJogo={JDadosFichaEmJogo} desativarAcoes={desativarAcoes}>
                <ConteudoFichaDeJogo_Interno exibirHabilidadesRuntime={exibirHabilidadesRuntime} exibirAcoesRuntime={exibirAcoesRuntime} exibirModificadoresRuntime={exibirModificadoresRuntime} codigoRecuperarFichaRuntime={codigoRecuperarFichaRuntime} codigoSala={codigoSala} estadoTemporalSalaJogo={estadoTemporalSalaJogo} />
            </ContextoFichaDePersonagemProvider>
        </ContextoControleNavegacaoFichaProvider>
    );
};

function ConteudoFichaDeJogo_Interno({ exibirHabilidadesRuntime, exibirAcoesRuntime, exibirModificadoresRuntime, codigoRecuperarFichaRuntime, codigoSala, estadoTemporalSalaJogo }: { exibirHabilidadesRuntime: boolean; exibirAcoesRuntime: boolean; exibirModificadoresRuntime: boolean; codigoRecuperarFichaRuntime?: CodigoRecuperarFichaRuntime; codigoSala?: SalaDeJogo_Codigo; estadoTemporalSalaJogo?: EstadoTemporalSalaDeJogoRuntime | null; }) {
    const { desativarAcoes } = useContextoFichaDePersonagem();
    const conteudo = <ConteudoFichaDeJogo_ComContexto exibirHabilidadesRuntime={exibirHabilidadesRuntime} exibirAcoesRuntime={exibirAcoesRuntime} exibirModificadoresRuntime={exibirModificadoresRuntime} codigoSala={codigoSala} />;

    const conteudoComAcoes = !exibirAcoesRuntime ? conteudo : desativarAcoes ? <ContextoControleAcoesRuntimeSomenteLeituraProvider>{conteudo}</ContextoControleAcoesRuntimeSomenteLeituraProvider> : <ContextoControleAcoesRuntimeProvider codigoRecuperarFichaRuntime={codigoRecuperarFichaRuntime} codigoSala={codigoSala} estadoTemporalSalaJogo={estadoTemporalSalaJogo}>{conteudo}</ContextoControleAcoesRuntimeProvider>;
    const conteudoComTestesPericia = desativarAcoes ? <ContextoControleTestesPericiaRuntimeSomenteLeituraProvider>{conteudoComAcoes}</ContextoControleTestesPericiaRuntimeSomenteLeituraProvider> : <ContextoControleTestesPericiaRuntimeProvider codigoRecuperarFichaRuntime={codigoRecuperarFichaRuntime}>{conteudoComAcoes}</ContextoControleTestesPericiaRuntimeProvider>;

    return (
        <ProvidersControleFicha>
            {conteudoComTestesPericia}
        </ProvidersControleFicha>
    );
};

function ConteudoFichaDeJogo_ComContexto({ exibirHabilidadesRuntime, exibirAcoesRuntime, exibirModificadoresRuntime, codigoSala }: { exibirHabilidadesRuntime: boolean; exibirAcoesRuntime: boolean; exibirModificadoresRuntime: boolean; codigoSala?: SalaDeJogo_Codigo; }) {
    const { paginaAbertaFicha, selecionaPaginaFicha, garantePaginaFichaValida } = useContextoControleNavegacaoFicha();
    const listaPaginas = [
        {
            nome: 'Perícias',
            componente: <PaginaControleAtributosPericias />,
            contexto: useContextoControleAtributosPericias
        },
        ...(exibirAcoesRuntime ? [{
            nome: 'Ações',
            componente: <PaginaControleAcoes />,
            contexto: obtemMenuVazioAcoesRuntime
        },
        {
            nome: 'Recursos',
            componente: <PaginaControleRecursos />,
            contexto: obtemMenuVazioRecursosRuntime
        }] : []),
        {
            nome: 'Inventário',
            componente: exibirAcoesRuntime ? <PaginaControleInventario /> : <><h1>oi</h1></>,
            contexto: exibirAcoesRuntime ? obtemMenuVazioInventarioRuntime : useContextoControleAtributosPericias
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
            componente: codigoSala ? <JanelaDeMensagensDeJogo codigoSala={codigoSala} /> : <></>,
            contexto: useContextoControleAtributosPericias
        },
    ];

    useEffect(() => {
        garantePaginaFichaValida(listaPaginas.length);
    }, [garantePaginaFichaValida, listaPaginas.length]);

    const paginaSelecionada = listaPaginas[paginaAbertaFicha] ?? listaPaginas[0];

    return (
        <>
            <CarrosselConteudoFichaDeJogo listaPaginas={listaPaginas} selecionaPaginaFicha={selecionaPaginaFicha} paginaAbertaFicha={paginaAbertaFicha} />

            <hr style={{ width: '100%' }} />

            {paginaSelecionada.componente}
        </>
    );
};

function obtemMenuVazioHabilidadesRuntime() { return { listaMenus: [] }; };
function obtemMenuVazioAcoesRuntime() { return { listaMenus: [] }; };
function obtemMenuVazioInventarioRuntime() { return { listaMenus: [] }; };
function obtemMenuVazioRecursosRuntime() { return { listaMenus: [] }; };
function obtemMenuVazioModificadoresRuntime() { return { listaMenus: [] }; };
