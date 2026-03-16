import styles from './styles.module.css';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export default function RecipienteCapa({ caminhoCapa, className }: { caminhoCapa: string, className?: string }) {
    return (
        <div className={styles.recipiente_capa}>
            <RecipienteImagem src={caminhoCapa} className={className} />
        </div>
    );
};