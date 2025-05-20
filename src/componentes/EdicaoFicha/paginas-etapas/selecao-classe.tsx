'use client';

import styles from '../styles.module.css';

import { EtapaGanhoEvolucao_Classes, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';
import CarrosselClasses from 'Componentes/Elementos/CarrosselClasses/CarrosselClasses';

export default function SelecaoClasse() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaSelecaoClasse = ganhos.etapas.find(ganho => ganho instanceof EtapaGanhoEvolucao_Classes)!;

    return (
        <div id={styles.recipiente_pagina_selecao_classe}>
            <CarrosselClasses />

            <div className={styles.recipiente_descricao_classe}>
                <p>{etapaSelecaoClasse.classeEmSelecao.descricao}</p>
            </div>
        </div>
    )
};