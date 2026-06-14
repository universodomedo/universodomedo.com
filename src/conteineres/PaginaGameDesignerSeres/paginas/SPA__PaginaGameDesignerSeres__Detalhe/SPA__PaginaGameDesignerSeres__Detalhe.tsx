import styles from './styles.module.css';

import { useContexto__PaginaGameDesignerSeres__Detalhe } from 'Contextos/Contexto__PaginaGameDesignerSeres__Detalhe/contexto';

export default function SPA__PaginaGameDesignerSeres__Detalhe() {
    const { idSerSelecionado } = useContexto__PaginaGameDesignerSeres__Detalhe();

    return (
        <section className={styles.detalhe_vazio}>
            <h2>Ser #{idSerSelecionado}</h2>
        </section>
    );
};
