'use client';

import styles from './BarraView.module.css';

export default function BarraView({ view, setView }: { view: 'quadro' | 'fluxograma'; setView: (view: 'quadro' | 'fluxograma') => void; }) {
    return (
        <div className={styles.toggle}>
            <button className={view === 'quadro' ? styles.ativo : ''} onClick={() => setView('quadro')}>Quadro</button>
            <button className={view === 'fluxograma' ? styles.ativo : ''} onClick={() => setView('fluxograma')}>Fluxograma</button>
        </div>
    );
};
