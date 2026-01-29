import styles from './styles.module.css';

import cn from 'classnames';

type TipoRecipienteAviso = 'positivo' | 'negativo';

export default function RecipienteAviso({ children, tipo }: { children: React.ReactNode; tipo: TipoRecipienteAviso; }) {
    return (
        <div className={cn(styles.caixa_aviso, tipo === 'negativo' ? styles.caixa_aviso_negativa : styles.caixa_aviso_positiva)}>
            {children}
        </div>
    );
};