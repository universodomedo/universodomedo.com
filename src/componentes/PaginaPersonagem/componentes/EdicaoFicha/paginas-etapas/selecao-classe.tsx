'use client';

import styles from '../styles.module.css';

import { EtapaGanhoEvolucao_Classes, useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';
import CarrosselClasses from 'Componentes/Elementos/CarrosselClasses/CarrosselClasses';
import Link from 'next/link';

export default function SelecaoClasse() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaSelecaoClasse = ganhos.etapas.find(ganho => ganho instanceof EtapaGanhoEvolucao_Classes)!;

    return (
        <div id={styles.recipiente_pagina_selecao_classe}>
            <CarrosselClasses />

            <div className={styles.recipiente_descricao_classe}>
                <Link href={`/definicoes/Classes/${etapaSelecaoClasse.classeEmSelecao.nome}`} target={'_blank'}><h2>{etapaSelecaoClasse.classeEmSelecao.nome}</h2></Link>
            </div>
        </div>
    );
};