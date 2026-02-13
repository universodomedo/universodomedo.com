import styles from './styles.module.css';

import { PAGINAS } from "types-nora-api";

import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo";
import { ControladorSlot } from "Layouts/ControladorSlot";


export function PaginaPasseDeJogador_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.minhasConfiguracoes.passeDeJogador}>
            <PaginaPasseDeJogador_Slot />
        </ControladorSlot>
    );
};

function PaginaPasseDeJogador_Slot() {
    return (
        <div className={styles.recipiente_pagina_passe_de_jogador}>
            <div className={styles.recipiente_informacoes_passe_de_jogador}>
                <SecaoDeConteudo fit>
                    <h1>Você possui 0 dias de Passe de Jogador</h1>
                </SecaoDeConteudo>

                <p>O Passe de Jogador oferece vários benefícios em seu acesso ao Universo do Medo</p>
                <p>Além de ajudar no desenvolvimento e manutenção do Universo do Medo, o Passe de Jogador te oferece os seguintes benefícios:</p>

                <ul>
                    <li>- Remoção do Limite do número de Fichar Temporárias</li>
                </ul>

                <h3>Novos benefícios serão disponibilizados em breve</h3>
            </div>
            <div className={styles.recipiente_botoes_passe_de_jogador}>
                <button disabled>Renovar</button>
            </div>
        </div>
    );
}; 