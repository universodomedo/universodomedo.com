'use client';

import styles from './notificacoesIconeBarra.module.css';

import { useContextoEventosUsuario } from 'Contextos/ContextoEventosUsuario/contexto';

// Etapa 17: ícone da ação de notificações na barra — só sino + badge de pendências (lido ao vivo do contexto).
// O alvo do tutorial (data-udm-tutorial) e o destaque ficam no <button> da própria barra (não aqui).
export default function NotificacoesIconeBarra() {
    const { pendentes } = useContextoEventosUsuario();

    return (
        <span className={styles.recipiente}>
            🔔
            {pendentes > 0 && <span className={styles.badge}>{pendentes}</span>}
        </span>
    );
};
