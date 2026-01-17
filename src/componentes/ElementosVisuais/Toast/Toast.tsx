'use client';

import styles from './styles.module.css';

import { type ToastItem } from 'Contextos/ContextoToast/contexto';

export default function ToastViewport({ visiveis, onFechar }: { visiveis: ToastItem[]; onFechar: (id: string) => void }) {
    return (
        <div className={styles.viewport}>
            {visiveis.map(t => (
                <div key={t.id} className={`${styles.toast} ${styles[`tipo_${t.tipo}`]}`}>
                    <div className={styles.toast_conteudo}>
                        <div className={styles.toast_titulo}>{t.titulo}</div>
                        {t.mensagem ? <div className={styles.toast_msg}>{t.mensagem}</div> : null}
                    </div>

                    <button className={styles.toast_fechar} onClick={() => onFechar(t.id)}>×</button>
                </div>
            ))}
        </div>
    );
};