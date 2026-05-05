'use client';

import styles from './styles.module.css';

import { GrupoAventura_DetalhesSessoes, GrupoAventura_Sessao } from 'types-nora-api';

import { useContexto__PaginaMestreAventuras__ComAventuraSelecionada } from "Contextos/Contexto__PaginaMestreAventuras__ComAventuraSelecionada/contextos";
import { useConfigurarLayoutContextualizado } from "Redux/hooks/useLayoutContextualizado";
import RenderCabecalhoCapa from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/CabecalhoDeAventura/page';
import { formataData } from '@/uteis/FormatadorDeDatas/FormatadorDeDatas';

export default function SPA__PaginaMestreAventuras__SemAventuraSelecionada() {
    const { grupoAventuraSelecionado, deselecionaGrupoAventura } = useContexto__PaginaMestreAventuras__ComAventuraSelecionada();

    useConfigurarLayoutContextualizado({ titulo: grupoAventuraSelecionado.nomeUnicoGrupoAventura, fecharProps: { tipo: 'acao', executar: () => { deselecionaGrupoAventura() }, tituloTooltip: 'Voltar' } }, 'patch');
    
    return (
        <div className={styles.recipiente_aventura_selecionada}>
            <RenderCabecalhoCapa caminhoArquivoArte={grupoAventuraSelecionado.dadosArteCapa.caminhoArquivoArteCapa} />

            {grupoAventuraSelecionado.detalhesSessoes.dataQueIniciou && <h2>{formataData(grupoAventuraSelecionado.detalhesSessoes.dataQueIniciou)}</h2>}
            <h2>{grupoAventuraSelecionado.detalhesSessoes.estadoAtual}</h2>
            <h2>{grupoAventuraSelecionado.detalhesSessoes.sessaoMaisRecente?.episodioPorExtenso}</h2>

            {/* {grupoAventuraSelecionado.detalhesSessoes.estadoAtual === AventuraEstado.EM_ANDAMENTO && <VisualizadorSessoes detalhesSessoes={grupoAventuraSelecionado.detalhesSessoes} />} */}

            {/* <InformacoesGeraisAventura /> */}
        </div>
    );
};

function VisualizadorSessoes({ detalhesSessoes }: { detalhesSessoes: GrupoAventura_DetalhesSessoes }) {
    return (
        <>
            {/* <VisualizadorUltimasSessoes detalhesSessoesAventuras={grupoAventuraSelecionada.detalhesSessoesAventuras.sort((a, b) => a.sessao.id - b.sessao.id).slice(-2)} /> */}
            {/* <AcoesSessoesRecentesDeAventurasEmAndamento /> */}
        </>
    );
};


function VisualizadorUltimasSessoes({ sessoesGrupoAventura }: { sessoesGrupoAventura: GrupoAventura_Sessao[] }) {
    return (
        <div id={styles.recipiente_visualizador_sessoes}>
            {sessoesGrupoAventura.map(sessao => (
                <p>{sessao.episodioPorExtenso}</p>
                // <VisualizacaoInformacoesSessao key={detalheUltimasSessoes.sessao.id} detalheUltimasSessoes={detalheUltimasSessoes} />
            ))}
        </div>
    );
};