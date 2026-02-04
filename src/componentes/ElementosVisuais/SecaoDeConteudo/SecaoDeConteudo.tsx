import styles from './styles.module.css';

import { HTMLAttributes, ReactNode } from "react";
import cn from 'classnames';

export default function SecaoDeConteudo(props: { children: ReactNode; fit?: boolean } & HTMLAttributes<HTMLDivElement>) {
    const { children, className, fit, ...rest } = props;
    
    return (
        <div className={cn(styles.recipiente_container_secao_conteudo, fit && styles.secao_conteudo_fit, className)} {...rest}>
            {children}
        </div>
    );
};