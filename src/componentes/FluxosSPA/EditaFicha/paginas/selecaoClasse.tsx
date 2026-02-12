'use client';

import styles from '../styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';
import { EtapaGanhoEvolucao_Classes } from 'Contextos/ContextoEdicaoFicha/classes';
import CarrosselClasses from 'Componentes/Elementos/CarrosselClasses/CarrosselClasses';
import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';

export default function SelecaoClasse() {
    const { ganhos } = useContextoEdicaoFicha();

    const etapaSelecaoClasse = ganhos.etapas.find(ganho => ganho instanceof EtapaGanhoEvolucao_Classes)!;

    return (
        <div id={styles.recipiente_pagina_selecao_classe}>
            <CarrosselClasses />

            <div className={styles.recipiente_descricao_classe}>
                <LinkInterno destino={{ pagina: PAGINAS.definicoes, params: { slug: ['Classes', etapaSelecaoClasse.classeEmSelecao.nome] } }} target={'_blank'}><h2>{etapaSelecaoClasse.classeEmSelecao.nome}</h2></LinkInterno>
            </div>
        </div>
    );
};