'use client';

import styles from './styles.module.css';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import ListaAcoesMestre from 'Componentes/ElementosDeMenu/ListaAcoesMestre/page';
import { useContextoPaginaMestreSessao } from 'Contextos/ContextoMestreSessao/contexto';
import { CabecalhoDeAventura } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/CabecalhoDeAventura/page';
import { InformacoesGeraisSessao, ListaInfracoesSessao } from './subcomponentes';
import { EstiloSessao } from 'types-nora-api';

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
        <div id={styles.recipiente_sessao_selecionada}>
            {sessaoSelecionada.estiloSessao == EstiloSessao.SESSAO_DE_AVENTURA && <CabecalhoDeAventura pathCapa={sessaoSelecionada.detalheSessaoAventura.grupoAventura.aventura.imagemCapa!.fullPath} titulo={sessaoSelecionada.detalheSessaoAventura.grupoAventura.nomeUnicoGrupoAventura} />}

            <InformacoesGeraisSessao />
            
            {/* <ListaInfracoesSessao /> */}
        </div>
    );
};