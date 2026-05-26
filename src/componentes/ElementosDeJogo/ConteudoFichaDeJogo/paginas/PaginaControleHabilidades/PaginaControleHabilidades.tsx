import styles from './styles.module.css';

import { Habilidade } from 'types-nora-api';

import { useContextoFichaDePersonagem } from 'Contextos/ContextoFichaDePersonagem/contexto';

export default function PaginaControleHabilidades() {
    const { habilidades } = useContextoFichaDePersonagem();

    return (
        <div className={styles.lista_habilidades}>
            {habilidades.map(habilidade => <HabilidadeEmFicha key={habilidade.key} habilidade={habilidade} />)}
        </div>
    );
};

function HabilidadeEmFicha({ habilidade }: { habilidade: Habilidade; }) {
    return (
        <div className={styles.habilidade}>
            <div className={styles.icone_habilidade} aria-hidden />
            <h2 className={styles.nome_habilidade}>{habilidade.nome}</h2>
        </div>
    );
};