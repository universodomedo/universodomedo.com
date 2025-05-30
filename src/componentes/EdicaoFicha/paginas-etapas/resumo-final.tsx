'use client';

import styles from '../styles.module.css';

import { useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';

export default function ResumoFinal() {
    const { ganhos } = useContextoEdicaoFicha();

    return (
        <div id={styles.recipiente_resumo_final}>
            {ganhos.detalhesEvolucao.filter(etapa => etapa.detalhes && etapa.detalhes.length > 0).map((etapa, indexEtapa) => (
                <div key={indexEtapa} className={styles.recipiente_resumo_final_etapa}>
                    <h2>{etapa.etapa}</h2>

                    <div className={styles.recipiente_informacoes_secao_etapa_evolucao}>
                        {etapa.detalhes.map((aviso, indexAviso) => (
                            <p key={indexAviso}>{aviso}</p>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};