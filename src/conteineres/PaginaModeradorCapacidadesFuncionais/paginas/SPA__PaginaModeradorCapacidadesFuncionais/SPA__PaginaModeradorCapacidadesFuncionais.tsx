import styles from './styles.module.css';

import { useContexto__PaginaModeradorCapacidadesFuncionais } from 'Contextos/Contexto__PaginaModeradorCapacidadesFuncionais/contexto';
import PainelFormularioCapacidadesFuncionais from './painelFormulario';
import PainelListagemCapacidadesFuncionais from './painelListagem';

export type ContextoCapacidades = ReturnType<typeof useContexto__PaginaModeradorCapacidadesFuncionais>;

export default function SPA__PaginaModeradorCapacidadesFuncionais() {
    const contexto = useContexto__PaginaModeradorCapacidadesFuncionais();

    return (
        <section className={styles.recipiente}>
            <PainelListagemCapacidadesFuncionais contexto={contexto} />
            <PainelFormularioCapacidadesFuncionais contexto={contexto} />
        </section>
    );
};
