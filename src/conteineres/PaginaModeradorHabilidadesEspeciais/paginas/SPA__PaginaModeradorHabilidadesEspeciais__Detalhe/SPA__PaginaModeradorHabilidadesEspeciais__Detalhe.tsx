import styles from './styles.module.css';

import { useContexto__PaginaModeradorHabilidadesEspeciais__Detalhe } from 'Contextos/Contexto__PaginaModeradorHabilidadesEspeciais__Detalhe/contexto';
import { descrevePropriedadesHabilidadeEspecial } from 'Uteis/HabilidadesEspeciais/formatacaoHabilidadeEspecial';

export default function SPA__PaginaModeradorHabilidadesEspeciais__Detalhe() {
    const { habilidade } = useContexto__PaginaModeradorHabilidadesEspeciais__Detalhe();

    return (
        <section className={styles.recipiente_detalhe}>
            <article className={styles.painel_detalhe}>
                <header className={styles.cabecalho_detalhe}>
                    <h2>{habilidade.habilidade.nome}</h2>
                    <div className={styles.contexto}>
                        <div>
                            <span>Custo</span>
                            <strong>{habilidade.custoPontosHabilidadeEspecial} pontos de habilidade especial</strong>
                        </div>
                        <div>
                            <span>Comportamento</span>
                            <strong>{descrevePropriedadesHabilidadeEspecial(habilidade.propriedades)}</strong>
                        </div>
                    </div>
                </header>

                <div className={styles.descricao}>
                    <span>Descrição</span>
                    <p>{habilidade.habilidade.descricao}</p>
                </div>
            </article>
        </section>
    );
};
