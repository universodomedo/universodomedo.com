'use client';

import styles from "./styles.module.css";
import { ControladorSlot } from 'Layouts/ControladorSlot';

import BarraEstatisticaDanificavel from 'Componentes/ElementosDeJogo/BarraEstatisticaDanificavel/page.tsx';
import BarraLocaisDeJogo from 'Componentes/ElementosDeJogo/BarraLocaisDeJogo/page.tsx';
import { ContextoFichaPersonagemProvider, useContextoFichaPersonagem } from "Contextos/ContextoFichaPersonagem/contexto";

export default function PaginaEmJogo() {
    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: false }}>
            <ContextoFichaPersonagemProvider>
                <PaginaEmJogo_Slot />
            </ContextoFichaPersonagemProvider>
        </ControladorSlot>
    );
};

function PaginaEmJogo_Slot() {
    return (
        <>
            <div className={styles.secao_cima}><PaginaFichaCima /></div>
            <div className={styles.secao_baixo}><PaginaFichaBaixo /></div>
        </>
    );
};

function PaginaFichaCima() {
    return (
        <div className={styles.tela_principal} />
    );
};

function PaginaFichaBaixo() {
    const { personagem } = useContextoFichaPersonagem();

    return (
        <>
            <div className={styles.fatia_parte_baixo_estatisticas}>
                <div className={styles.fatia_parte_baixo_estatisticas_danificaveis}>
                    {/* <div className={styles.recipiente_estatistica_danificavel}>
                        <BarraEstatisticaDanificavel titulo={'P.V.'} valorAtual={30} valorMaximo={30} corBarra={'#FF0000'} />
                    </div>
                    <div className={styles.recipiente_estatistica_danificavel}>
                        <BarraEstatisticaDanificavel titulo={'P.S.'} valorAtual={20} valorMaximo={20} corBarra={'#324A99'} />
                    </div>
                    <div className={styles.recipiente_estatistica_danificavel}>
                        <BarraEstatisticaDanificavel titulo={'P.E.'} valorAtual={25} valorMaximo={25} corBarra={'#47BA16'} />
                    </div> */}
                    {personagem?.estatisticasDanificaveisPersonagem?.map(estatisticaPersonagem => (
                        <div key={estatisticaPersonagem.estatisticaDanificavel.id} className={styles.recipiente_estatistica_danificavel}>
                            <BarraEstatisticaDanificavel titulo={estatisticaPersonagem.estatisticaDanificavel.nomeAbreviado} valorAtual={estatisticaPersonagem.valorAtual} valorMaximo={estatisticaPersonagem.valorMaximo} corBarra={estatisticaPersonagem.estatisticaDanificavel.cor} />
                        </div>
                    ))}
                </div>
                <div className={styles.fatia_parte_baixo_execucoes}>
                    <div className={styles.recipiente_execucao}>
                        <p>Ação Padrão</p>
                        <p>1/1</p>
                    </div>
                </div>
            </div>
            <div className={styles.fatia_parte_baixo_atalhos}>
                <div className={styles.barra_locais}>
                    <BarraLocaisDeJogo />
                </div>

                <div className={styles.barras}>
                </div>
            </div>
            <div className={`${styles.fatia_parte_baixo_detalhes}`}>
                <div className={styles.recipiente_informacoes_personagem}>
                    <h2>{personagem?.informacao?.nome}</h2>
                    <h2>{`${personagem?.detalhe?.classe.nome} - ${personagem?.detalhe?.nivel.nomeVisualizacao}`}</h2>
                </div>
                <div className={styles.recipiente_imagem_personagem}>
                    <div id={styles.imagem_personagem} />
                </div>
            </div>
        </>
    );
};