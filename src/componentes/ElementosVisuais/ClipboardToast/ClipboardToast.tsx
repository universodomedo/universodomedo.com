'use client';

import styles from './styles.module.css';

import { useContextoCopiarParaClipboard } from 'Contextos/ContextoCopiarParaClipboard/contexto';

export default function ClipboardToast() {
    const { mensagemToast } = useContextoCopiarParaClipboard();
    if (!mensagemToast) return null;

    return (
        <div className={styles.toast}>
            {mensagemToast}
        </div>
    );
}