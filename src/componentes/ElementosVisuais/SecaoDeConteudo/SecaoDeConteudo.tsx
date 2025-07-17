import styles from './styles.module.css';
import { HTMLAttributes, ReactNode } from "react";
import cn from 'classnames';

export default function SecaoDeConteudo(props: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
    const { children, className, ...rest } = props;
    
    return (
        <div className={cn(styles.recipiente_container_info_assistindo_grupo_aventura, className)} {...rest}>
            {children}
        </div>
    );
}