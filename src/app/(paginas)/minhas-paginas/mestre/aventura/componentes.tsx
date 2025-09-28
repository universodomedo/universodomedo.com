'use client';

import styles from './styles.module.css';

import { AventuraEstado } from 'types-nora-api';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import ListaAcoesMestre from 'Componentes/ElementosDeMenu/ListaAcoesMestre/page';
import { useContextoPaginaMestreAventura } from "Contextos/ContextoMestreAventura/contexto";
import { CabecalhoDeAventura } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/CabecalhoDeAventura/page';
import { VisualizadorSessoes } from './subcomponentes/VisualizadorSessoes/VisualizadorSessoes';
import { InformacoesGeraisAventura } from './subcomponentes/InformacoesGeraisAventura/InformacoesGeraisAventura';

export function PaginaMestreAventura_Contexto() {
    return (
        <LayoutContextualizado proporcaoConteudo={84}>
            <LayoutContextualizado.Conteudo hrefPaginaRetorno={'/minhas-paginas/mestre/aventuras'}>
                <PaginaMestreAventura_Conteudo />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <ListaAcoesMestre />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function PaginaMestreAventura_Conteudo() {
    const { grupoAventuraSelecionada } = useContextoPaginaMestreAventura();

    return (
        <div id={styles.recipiente_aventura_selecionada}>
            <CabecalhoDeAventura pathCapa={grupoAventuraSelecionada.aventura.imagemCapa!.fullPath} titulo={grupoAventuraSelecionada.nomeUnicoGrupoAventura} />

            {grupoAventuraSelecionada.estadoAtual === AventuraEstado.EM_ANDAMENTO && <VisualizadorSessoes />}

            <InformacoesGeraisAventura />
        </div>
    );
};