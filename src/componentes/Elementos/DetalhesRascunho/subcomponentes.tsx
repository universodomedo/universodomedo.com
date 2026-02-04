import styles from './styles.module.css';

import { DetalheRascunhoAventuraDto, DetalheRascunhoSessaoUnicaCanonicaDto, DetalheRascunhoSessaoUnicaNaoCanonicaDto, RascunhoDto } from 'types-nora-api';

import VisualizadorConteudoTiptap from 'Componentes/Elementos/Tiptap/VisualizadorConteudoTiptap/VisualizadorConteudoTiptap';

export function DadosResumo({ rascunho }: { rascunho: RascunhoDto }) {
    if (rascunho.estiloSessaoMestrada.id === 1) return <DadosResumo_Aventura detalheRascunhoAventura={rascunho.detalheRascunhoAventura!} />
    if (rascunho.estiloSessaoMestrada.id === 2) return <DadosResumo_SessaoUnicaCanonica detalheRascunhoSessaoUnicaCanonica={rascunho.detalheRascunhoSessaoUnicaCanonica!} />
    if (rascunho.estiloSessaoMestrada.id === 3) return <DadosResumo_SessaoUnicaNaoCanonico detalheRascunhoSessaoUnicaNaoCanonica={rascunho.detalheRascunhoSessaoUnicaNaoCanonica!} />
    else return <></>;
};

function DadosResumo_Aventura({ detalheRascunhoAventura }: { detalheRascunhoAventura: DetalheRascunhoAventuraDto }) {
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

function DadosResumo_SessaoUnicaCanonica({ detalheRascunhoSessaoUnicaCanonica }: { detalheRascunhoSessaoUnicaCanonica: DetalheRascunhoSessaoUnicaCanonicaDto }) {
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

function DadosResumo_SessaoUnicaNaoCanonico({ detalheRascunhoSessaoUnicaNaoCanonica }: { detalheRascunhoSessaoUnicaNaoCanonica: DetalheRascunhoSessaoUnicaNaoCanonicaDto }) {
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