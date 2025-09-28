import styles from './styles.module.css';
import { HTMLAttributes, ReactNode } from "react";
import cn from 'classnames';

export default function SecaoDeConteudo(props: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
    const { children, className, ...rest } = props;
    
    return (
        <div className={cn(styles.recipiente_container_secao_conteudo, className)} {...rest}>
            {children}
        </div>
    );
}