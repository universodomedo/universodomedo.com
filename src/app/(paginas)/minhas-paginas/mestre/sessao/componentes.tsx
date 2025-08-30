'use client';

import styles from './styles.module.css';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import ListaAcoesMestre from 'Componentes/ElementosDeMenu/ListaAcoesMestre/page';
import { useContextoPaginaMestreSessao } from 'Contextos/ContextoMestreSessao/contexto';
import { CabecalhoDeAventura } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/CabecalhoDeAventura/page';
import { InformacoesGeraisSessao, ListaAlertasSessao } from './subcomponentes';

export function PaginaMestreSessao_Contexto() {
    const { sessaoSelecionada } = useContextoPaginaMestreSessao();

    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo hrefPaginaRetorno={`/minhas-paginas/mestre/aventura/${sessaoSelecionada.detalheSessaoCanonica.grupoAventura?.id}`}>
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
            <CabecalhoDeAventura pathCapa={sessaoSelecionada.detalheSessaoCanonica.grupoAventura!.aventura.imagemCapa!.fullPath} titulo={sessaoSelecionada.detalheSessaoCanonica.grupoAventura!.nomeUnicoGrupoAventura} />

            <InformacoesGeraisSessao />
            
            <ListaAlertasSessao />
        </div>
    );
};