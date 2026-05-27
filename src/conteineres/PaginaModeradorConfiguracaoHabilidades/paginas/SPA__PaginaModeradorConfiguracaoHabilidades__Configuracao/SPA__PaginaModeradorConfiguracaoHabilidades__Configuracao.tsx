import styles from './styles.module.css';

import { useContexto__PaginaModeradorConfiguracaoHabilidades__Configuracao } from 'Contextos/Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao/contexto';

export default function SPA__PaginaModeradorConfiguracaoHabilidades__Configuracao() {
    const { habilidade } = useContexto__PaginaModeradorConfiguracaoHabilidades__Configuracao();

    return (
        <section className={styles.recipiente_configuracao}>
            <article className={styles.painel_configuracao}>
                <span>Habilidade em configuração</span>
                <h2>{habilidade.nome}</h2>
            </article>
        </section>
    );
};