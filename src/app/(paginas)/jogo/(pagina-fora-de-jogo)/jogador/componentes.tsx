'use client';

import styles from "./styles.module.css";

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import JogoRouteGuard from '../../JogoRouteGuard';
// import ControladorSwiperFicha from "Componentes/ElementosDeJogo/ControladorSwiperFicha/CotroladorSwiperFicha";
import BarraEstatisticaDanificavel from 'Componentes/ElementosDeJogo/BarraEstatisticaDanificavel/page.tsx';
import BarraLocaisDeJogo from 'Componentes/ElementosDeJogo/BarraLocaisDeJogo/page.tsx';

export function PaginaEmJogo_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.jogo.jogador} embrulho={JogoRouteGuard}>
            <></>
        </ControladorSlot>
    );
};

// function PaginaEmJogo_Contexto() {
//     return (
//         <div id={styles.recipiente_pagina_jogo}>
//             <div className={styles.secao_cima}><PaginaFichaCima /></div>
//             <ControladorSwiperFicha />
//             <div className={styles.secao_baixo}><PaginaFichaBaixo /></div>
//         </div>
//     );
// };

// function PaginaFichaCima() {
//     return (
//         <div className={styles.tela_principal} />
//     );
// };

// function PaginaFichaBaixo() {
//     const { ficha } = useContextoFichaPersonagem();

//     return (
//         <>
//             <div className={styles.fatia_parte_baixo_estatisticas}>
//                 <div className={styles.fatia_parte_baixo_estatisticas_danificaveis}>
//                     {ficha?.estatisticasDanificaveis.map(estatisticaPersonagem => (
//                         <div key={estatisticaPersonagem.estatisticaDanificavel.id} className={styles.recipiente_estatistica_danificavel}>
//                             <BarraEstatisticaDanificavel titulo={estatisticaPersonagem.estatisticaDanificavel.nomeAbreviado} valorAtual={estatisticaPersonagem.valorMaximo} valorMaximo={estatisticaPersonagem.valorMaximo} corBarra={estatisticaPersonagem.estatisticaDanificavel.cor} />
//                         </div>
//                     ))}
//                 </div>
//                 <div className={styles.fatia_parte_baixo_execucoes}>
//                     <div className={styles.recipiente_execucao}>
//                         <p>Ação Padrão</p>
//                         <p>1/1</p>
//                     </div>
//                 </div>
//             </div>
//             <div className={styles.fatia_parte_baixo_atalhos}>
//                 <div className={styles.barra_locais}>
//                     <BarraLocaisDeJogo />
//                 </div>

//                 <div className={styles.barras}>
//                 </div>
//             </div>
//             <div className={`${styles.fatia_parte_baixo_detalhes}`}>
//                 <div className={styles.recipiente_informacoes_personagem}>
//                     {/* <h2>{ficha?.personagem.informacao.nome}</h2>
//                     <h2>{`${ficha?.personagem.detalhe?.classe.nome} - ${personagem?.detalhe?.nivel.nomeVisualizacao}`}</h2> */}
//                 </div>
//                 <div className={styles.recipiente_imagem_personagem}>
//                     <div id={styles.imagem_personagem}>
//                         {/* <RecipienteImagem src={ficha?.personagem.caminhoAvatar} /> */}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };