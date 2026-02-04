'use client';

import styles from './styles.module.css';

import { AventuraEstado, PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaMestreAventuraProvider } from 'Contextos/ContextoMestreAventura/contexto';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { useContextoPaginaMestreAventura } from "Contextos/ContextoMestreAventura/contexto";
import { CabecalhoDeAventura } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/CabecalhoDeAventura/page';
import { VisualizadorSessoes } from './subcomponentes/VisualizadorSessoes/VisualizadorSessoes';
import { InformacoesGeraisAventura } from './subcomponentes/InformacoesGeraisAventura/InformacoesGeraisAventura';

export function PaginaMestreAventura_Client({ idGrupoAventura }: { idGrupoAventura: number; }) {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre.aventura}>
            <ContextoPaginaMestreAventuraProvider idGrupoAventura={idGrupoAventura}>
                <PaginaMestreAventura_Slot />
            </ContextoPaginaMestreAventuraProvider>
        </ControladorSlot>
    );
};

function PaginaMestreAventura_Slot() {
    useConfigurarLayoutContextualizado({ titulo: `aaaav`, fecharProps: { tipo: 'href', paginaRetorno: PAGINAS.minhasPaginas.mestre.aventuras, tituloTooltip: 'Voltar' } }, 'patch');
    const { grupoAventuraSelecionada } = useContextoPaginaMestreAventura();

    return (
        <div id={styles.recipiente_aventura_selecionada}>
            <CabecalhoDeAventura tipo={'grupoAventura'} grupoAventura={grupoAventuraSelecionada} />

            {grupoAventuraSelecionada.estadoAtual === AventuraEstado.EM_ANDAMENTO && <VisualizadorSessoes />}

            <InformacoesGeraisAventura />
        </div>
    );
};