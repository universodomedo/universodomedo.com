import { SessaoDto } from 'types-nora-api';
import styles from './styles.module.css';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export default function RecipienteCapa({ sessao, className }: { sessao: SessaoDto, className?: string }) {
    return (
        <div className={styles.recipiente_capa}>
            <RecipienteImagem src={sessao.pathCapaInteligente} className={className} />
        </div>
    );
};