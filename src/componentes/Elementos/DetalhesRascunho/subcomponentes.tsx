import styles from './styles.module.css';

import { DetalheRascunhoAventuraCompletaDto, DetalheRascunhoSessaoUnicaCanonicaCompletaDto, DetalheRascunhoSessaoUnicaNaoCanonicaCompletaDto, ESTILOS_SESSAO_MESTRADA, RascunhoCompletaDto } from 'types-nora-api';

import VisualizadorConteudoTiptap from 'Componentes/Elementos/Tiptap/VisualizadorConteudoTiptap/VisualizadorConteudoTiptap';

export function DadosResumo({ rascunho }: { rascunho: RascunhoCompletaDto }) {
    if (!rascunho.detalheRascunho) return <h3>Não existem configurações para esse Rascunho</h3>;

    return (
        <div className={styles.recipiente_dados_rascunho}>
            {
                rascunho.idEstiloSessaoMestrada === ESTILOS_SESSAO_MESTRADA.AVENTURA.id ? <DadosResumo_Aventura detalheRascunhoAventura={rascunho.detalheRascunho} />
                : rascunho.idEstiloSessaoMestrada === ESTILOS_SESSAO_MESTRADA.SESSAO_UNICA_CANONICA.id ? <DadosResumo_SessaoUnicaCanonica detalheRascunhoSessaoUnicaCanonica={rascunho.detalheRascunho} />
                : <DadosResumo_SessaoUnicaNaoCanonico detalheRascunhoSessaoUnicaNaoCanonica={rascunho.detalheRascunho} />
            }
        </div>
    );
};

function DadosResumo_Aventura({ detalheRascunhoAventura }: { detalheRascunhoAventura: DetalheRascunhoAventuraCompletaDto }) {
    return (
        <>
            <div id={styles.recipiente_opcoes_detalhes_rascunho}>
                
            </div>
            <div id={styles.recipiente_descricao_detalhes_rascunho}>
                <VisualizadorConteudoTiptap conteudo={detalheRascunhoAventura.descricao} />
            </div>
        </>
    );
};

function DadosResumo_SessaoUnicaCanonica({ detalheRascunhoSessaoUnicaCanonica }: { detalheRascunhoSessaoUnicaCanonica: DetalheRascunhoSessaoUnicaCanonicaCompletaDto }) {
    return (
        <>
            <div id={styles.recipiente_opcoes_detalhes_rascunho}>
                <div className={styles.opcao_detalhe_rascunho}>
                    <h2>Dificuldade</h2>
                    <h3>{detalheRascunhoSessaoUnicaCanonica.dificuldadeSessao.descricao}</h3>
                </div>
                <div className={styles.opcao_detalhe_rascunho}>
                    <h2>Tipo de Sessão</h2>
                    <h3>{detalheRascunhoSessaoUnicaCanonica.tipoSessao.descricao}</h3>
                </div>
            </div>
            <div id={styles.recipiente_descricao_detalhes_rascunho}>
                <VisualizadorConteudoTiptap conteudo={detalheRascunhoSessaoUnicaCanonica.descricao} />
            </div>
        </>
    );
};

function DadosResumo_SessaoUnicaNaoCanonico({ detalheRascunhoSessaoUnicaNaoCanonica }: { detalheRascunhoSessaoUnicaNaoCanonica: DetalheRascunhoSessaoUnicaNaoCanonicaCompletaDto }) {
    return (
        <>
            <div id={styles.recipiente_opcoes_detalhes_rascunho}>
                <div className={styles.opcao_detalhe_rascunho}>
                    <h2>Jogadores</h2>
                    <h3>{detalheRascunhoSessaoUnicaNaoCanonica.numeroMinimoJogadores}-{detalheRascunhoSessaoUnicaNaoCanonica.numeroMaximoJogadores}</h3>
                </div>
                <div className={styles.opcao_detalhe_rascunho}>
                    <h2>GEP</h2>
                    <h3>{detalheRascunhoSessaoUnicaNaoCanonica.nivelPersonagem.valorNivel}</h3>
                </div>
                <div className={styles.opcao_detalhe_rascunho}>
                    <h2>Dificuldade</h2>
                    <h3>{detalheRascunhoSessaoUnicaNaoCanonica.dificuldadeSessao.descricao}</h3>
                </div>
                <div className={styles.opcao_detalhe_rascunho}>
                    <h2>Tipo de Sessão</h2>
                    <h3>{detalheRascunhoSessaoUnicaNaoCanonica.tipoSessao.descricao}</h3>
                </div>
            </div>
            <div id={styles.recipiente_descricao_detalhes_rascunho}>
                <VisualizadorConteudoTiptap conteudo={detalheRascunhoSessaoUnicaNaoCanonica.descricao} />
            </div>
        </>
    );
};