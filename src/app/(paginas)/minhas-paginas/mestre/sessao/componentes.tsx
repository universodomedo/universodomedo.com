'use client';

import { EstiloSessao, MENUS_INTERNOS } from 'types-nora-api';

import { useContextoPaginaMestreSessao } from 'Contextos/ContextoMestreSessao/contexto';
import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';
import SessaoEmVisualizacao from 'Componentes/ElementosVisuais/SessaoEmVisualizacao/page';

export function PaginaMestreSessao_Contexto() {
    const { sessaoSelecionada } = useContextoPaginaMestreSessao();

    const hrefPaginaRetorno = sessaoSelecionada.estiloSessao == EstiloSessao.SESSAO_DE_AVENTURA
        ? `/minhas-paginas/mestre/aventura/${sessaoSelecionada.detalheSessaoAventura.grupoAventura.id}`
        : 'minhas-paginas/mestre/sessoes-unicas'

    return (
        <LayoutContextualizado proporcaoConteudo={84}>
            <LayoutContextualizado.Conteudo props={{ tipo: 'href', hrefPaginaRetorno: hrefPaginaRetorno, tituloTooltip: 'Voltar' }}>
                <PaginaMestreSessao_Conteudo />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <MenuInterno itens={MENUS_INTERNOS.PAGINAS.minhasPaginas.mestre} />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function PaginaMestreSessao_Conteudo() {
    const { sessaoSelecionada } = useContextoPaginaMestreSessao();

    return (
        <>
            <SessaoEmVisualizacao sessao={sessaoSelecionada} />
            
            {/* <ListaInfracoesSessao /> */}
        </>
    );
};