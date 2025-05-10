'use client';

import styles from '../styles.module.css';

import { useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';

export default function ResumoFinal() {
    const { ganhos } = useContextoEdicaoFicha();

    return (
        <>
            {ganhos.resumoEvolucao.map((etapa, indexEtapa) => (
                <div key={indexEtapa} className={styles.recipiente_etapa_resumo_final}>
                    <h2>{etapa.tituloEtapa}</h2>

                    {etapa.avisos.map((aviso, indexAviso) => (
                        <p key={indexAviso}>{aviso.mensagem}</p>
                    ))}
                </div>
            ))}
        </>
    );
};