'use client';

import styles from './styles.module.css';

import { AventuraEstado, MENUS_INTERNOS } from 'types-nora-api';

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import MenuInterno from 'Componentes/ElementosDeMenu/componentes';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { useContextoPaginaMestreAventura } from "Contextos/ContextoMestreAventura/contexto";
import { CabecalhoDeAventura } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/CabecalhoDeAventura/page';
import { VisualizadorSessoes } from './subcomponentes/VisualizadorSessoes/VisualizadorSessoes';
import { InformacoesGeraisAventura } from './subcomponentes/InformacoesGeraisAventura/InformacoesGeraisAventura';

export function PaginaMestreAventura_Contexto() {
    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo>
                <PaginaMestreAventura_Conteudo />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <MenuInterno itens={MENUS_INTERNOS.PAGINAS.minhasPaginas.mestre} />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function PaginaMestreAventura_Conteudo() {
    useConfigurarLayoutContextualizado({ proporcaoConteudo: 84, fecharProps: { tipo: 'href', hrefPaginaRetorno: '/minhas-paginas/mestre/aventuras', tituloTooltip: 'Voltar' } });
    const { grupoAventuraSelecionada } = useContextoPaginaMestreAventura();

    return (
        <div id={styles.recipiente_aventura_selecionada}>
            <CabecalhoDeAventura tipo={'grupoAventura'} grupoAventura={grupoAventuraSelecionada} />
            
            {grupoAventuraSelecionada.estadoAtual === AventuraEstado.EM_ANDAMENTO && <VisualizadorSessoes />}

            <InformacoesGeraisAventura />
        </div>
    );
};