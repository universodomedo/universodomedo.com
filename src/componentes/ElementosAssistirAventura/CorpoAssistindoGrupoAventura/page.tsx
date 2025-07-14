import styles from './styles.module.css';

import { CabecalhoGrupoAventura, CorpoGrupoAventura } from './componentes';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';

export default function CorpoAssistindoGrupoAventura() {
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <div id={styles.recipiente_corpo_foreground} {...scrollableProps}>
            <CabecalhoGrupoAventura />

            <CorpoGrupoAventura />
        </div>
    );
};