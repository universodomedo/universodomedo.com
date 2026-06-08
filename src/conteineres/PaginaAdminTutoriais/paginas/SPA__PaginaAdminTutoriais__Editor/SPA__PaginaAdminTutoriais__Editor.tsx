import styles from './styles.module.css';

import { useContexto__PaginaAdminTutoriais__Editor } from 'Contextos/Contexto__PaginaAdminTutoriais__Editor/contexto';

export default function SPA__PaginaAdminTutoriais__Editor() {
    const { tutorialEmEdicaoId, voltarParaListagem } = useContexto__PaginaAdminTutoriais__Editor();

    return (
        <section className={styles.placeholder}>
            <strong>{tutorialEmEdicaoId === null ? 'Novo Tutorial' : `Editar Tutorial #${tutorialEmEdicaoId}`}</strong>
            <p className={styles.aviso}>O editor de Tutoriais será implementado em uma etapa futura.</p>
            <button type="button" className={styles.botao_voltar} onClick={voltarParaListagem}>Voltar para Listagem</button>
        </section>
    );
};
