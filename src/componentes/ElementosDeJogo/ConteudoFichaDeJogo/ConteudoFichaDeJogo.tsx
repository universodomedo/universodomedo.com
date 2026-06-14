'use client';

import { useEffect } from "react";
import { J_DadosFichaEmJogo } from "types-nora-api";

import { ContextoFichaDePersonagemProvider, useContextoFichaDePersonagem } from "Contextos/ContextoFichaDePersonagem/contexto";
import combineProviders from 'Contextos/combineProviders';
import { ContextoControleAtributosPericiasProvider, useContextoControleAtributosPericias } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleAtributosPericias/contexto';
import { ContextoControleAcoesRuntimeProvider, ContextoControleAcoesRuntimeSomenteLeituraProvider } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleAcoesRuntime/contexto';
import { ContextoControleTestesPericiaRuntimeProvider, ContextoControleTestesPericiaRuntimeSomenteLeituraProvider } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleTestesPericiaRuntime/contexto';
import { ContextoControleNavegacaoFichaProvider, useContextoControleNavegacaoFicha } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleNavegacaoFicha/contexto';
import PaginaControleAtributosPericias from './paginas/PaginaControleAtributosPericias/PaginaControleAtributosPericias';
import PaginaControleAcoes from './paginas/PaginaControleAcoes/PaginaControleAcoes';
import PaginaControleHabilidades from './paginas/PaginaControleHabilidades/PaginaControleHabilidades';
import PaginaControleModificadores from './paginas/PaginaControleModificadores/PaginaControleModificadores';
import PaginaControleRecursos from './paginas/PaginaControleRecursos/PaginaControleRecursos';
import CarrosselConteudoFichaDeJogo from '../CarrosselConteudoFichaDeJogo/CarrosselConteudoFichaDeJogo';

const ProvidersControleFicha = combineProviders(
    ContextoControleAtributosPericiasProvider,
);

export default function ConteudoFichaDeJogo({ JDadosFichaEmJogo, desativarAcoes, exibirHabilidadesRuntime = false, exibirAcoesRuntime = false, exibirModificadoresRuntime = false }: { JDadosFichaEmJogo: J_DadosFichaEmJogo; desativarAcoes: boolean; exibirHabilidadesRuntime?: boolean; exibirAcoesRuntime?: boolean; exibirModificadoresRuntime?: boolean; }) {
    return (
        <ContextoControleNavegacaoFichaProvider>
            <ContextoFichaDePersonagemProvider JDadosFichaEmJogo={JDadosFichaEmJogo} desativarAcoes={desativarAcoes}>
                <ConteudoFichaDeJogo_Interno exibirHabilidadesRuntime={exibirHabilidadesRuntime} exibirAcoesRuntime={exibirAcoesRuntime} exibirModificadoresRuntime={exibirModificadoresRuntime} />
            </ContextoFichaDePersonagemProvider>
        </ContextoControleNavegacaoFichaProvider>
    );
};

function ConteudoFichaDeJogo_Interno({ exibirHabilidadesRuntime, exibirAcoesRuntime, exibirModificadoresRuntime }: { exibirHabilidadesRuntime: boolean; exibirAcoesRuntime: boolean; exibirModificadoresRuntime: boolean; }) {
    const { desativarAcoes } = useContextoFichaDePersonagem();
    const conteudo = <ConteudoFichaDeJogo_ComContexto exibirHabilidadesRuntime={exibirHabilidadesRuntime} exibirAcoesRuntime={exibirAcoesRuntime} exibirModificadoresRuntime={exibirModificadoresRuntime} />;
    const ProviderAcoesRuntime = desativarAcoes ? ContextoControleAcoesRuntimeSomenteLeituraProvider : ContextoControleAcoesRuntimeProvider;
    const ProviderTestesPericiaRuntime = desativarAcoes ? ContextoControleTestesPericiaRuntimeSomenteLeituraProvider : ContextoControleTestesPericiaRuntimeProvider;

    return (
        <ProvidersControleFicha>
            <ProviderTestesPericiaRuntime>
                {exibirAcoesRuntime ? <ProviderAcoesRuntime>{conteudo}</ProviderAcoesRuntime> : conteudo}
            </ProviderTestesPericiaRuntime>
        </ProvidersControleFicha>
    );
};

function ConteudoFichaDeJogo_ComContexto({ exibirHabilidadesRuntime, exibirAcoesRuntime, exibirModificadoresRuntime }: { exibirHabilidadesRuntime: boolean; exibirAcoesRuntime: boolean; exibirModificadoresRuntime: boolean; }) {
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
function obtemMenuVazioRecursosRuntime() { return { listaMenus: [] }; };
function obtemMenuVazioModificadoresRuntime() { return { listaMenus: [] }; };