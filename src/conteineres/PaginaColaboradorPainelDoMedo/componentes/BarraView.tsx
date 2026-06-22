'use client';

import styles from './BarraView.module.css';

export default function BarraView({ pagina, setPagina }: { pagina: string; setPagina: (pagina: 'quadro' | 'fluxograma') => void; }) {
    return (
        <div className={styles.toggle}>
            <button className={pagina === 'quadro' ? styles.ativo : ''} onClick={() => setPagina('quadro')}>Quadro</button>
            <button className={pagina === 'fluxograma' ? styles.ativo : ''} onClick={() => setPagina('fluxograma')}>Fluxograma</button>
        </div>
    );
};
