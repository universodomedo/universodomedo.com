'use client';

import styles from '../styles.module.css';

import { useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto';

export default function ResumoFinal() {
    const { ganhos } = useContextoEdicaoFicha();

    return (
        <div id={styles.recipiente_resumo_final}>
            {ganhos.classeSelecionadaNessaEvolucao && (
                <div className={styles.recipiente_resumo_final_etapa}>
                    <h2>Classe</h2>

                    <p>Você selecionou a classe {ganhos.classeSelecionadaNessaEvolucao.nome}</p>
                </div>
            )}
            {ganhos.resumoEvolucao.map((etapa, indexEtapa) => (
                <div key={indexEtapa} className={styles.recipiente_resumo_final_etapa}>
                    <h2>{etapa.tituloEtapa}</h2>

                    <div className={styles.recipiente_informacoes_secao_etapa_evolucao}>
                        {etapa.avisos.map((aviso, indexAviso) => {
                            return (aviso.tipo !== 'subitem') ? (
                                <p key={indexAviso}>{aviso.mensagem}</p>
                            ) : (
                                <p key={indexAviso} className={styles.resumo_final_subtipo}>{aviso.mensagem}</p>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};