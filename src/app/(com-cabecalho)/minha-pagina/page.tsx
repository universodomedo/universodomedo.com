'use client';

import ModalPrimeiroAcesso from "Componentes/ElementosDeJogo/ModalPrimeiroAcesso/page";
import styles from "./styles.module.css";

export default function MinhaPagina() {
    if (true) {
        return (
            <ModalPrimeiroAcesso />
        );
    }

    return (
        <div id={styles.portal_jogador}>
            <div id={styles.portal_jogador_esquerda}>
                <div id={styles.barra_jogador}>
                    <h1>Visitante</h1>
                </div>

                <div id={styles.notificacoes_jogador}>

                </div>
            </div>

            <div id={styles.portal_jogador_direita}>

            </div>
        </div>
    );
};