'use client';

import styles from './styles.module.css';

import { type ReactNode } from 'react';

/**
 * Moldura das telas de acesso (entrar, criar conta, recuperar e redefinir senha).
 * Os avisos ficam FORA do fluxo do painel de propósito: mensagem de sucesso, erro ou reenvio nunca pode deslocar campos e botões — a pessoa clica onde estava olhando.
 */
export default function PainelAcesso({ titulo, avisos, children }: { titulo: string; avisos?: ReactNode; children: ReactNode }) {
    return (
        <div className={styles.palco}>
            <section className={styles.painel}>
                <div className={styles.avisos} aria-live="polite">{avisos}</div>

                <h1 className={styles.titulo}>{titulo}</h1>

                {children}
            </section>
        </div>
    );
};