'use client';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import ListaAcoesMestre from 'Componentes/ElementosDeMenu/ListaAcoesMestre/page';
import { useContextoPaginaMestreSessao } from 'Contextos/ContextoMestreSessao/contexto';
import { EstiloSessao } from 'types-nora-api';
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
                <ListaAcoesMestre />
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