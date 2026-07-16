'use client';

import styles from './styles.module.css';

import { type ToastItem } from 'Contextos/ContextoToast/contexto';
import RefsDeCartao from 'Componentes/ElementosVisuais/RefsDeCartao/RefsDeCartao';

export default function ToastViewport({ visiveis, onFechar }: { visiveis: ToastItem[]; onFechar: (id: string) => void }) {
    return (
        <div className={styles.viewport}>
            {visiveis.map(t => (
                <div key={t.id} className={`${styles.toast} ${styles[`tipo_${t.tipo}`]}`}>
                    <div className={styles.toast_conteudo}>
                        <div className={styles.toast_titulo}>{t.titulo}</div>
                        {t.mensagem ? <div className={styles.toast_msg}><RefsDeCartao texto={t.mensagem} aoNavegar={() => onFechar(t.id)} /></div> : null}
                        {t.acoes && t.acoes.length > 0 && (
                            <div className={styles.toast_acoes}>
                                {t.acoes.map(acao => <button key={acao.rotulo} className={styles.toast_acao} onClick={() => { acao.executar(); onFechar(t.id); }}>{acao.rotulo}</button>)}
                            </div>
                        )}
                    </div>

                    <button className={styles.toast_fechar} onClick={() => onFechar(t.id)}>×</button>
                </div>
            ))}
        </div>
    );
};