import styles from './styles.module.css';

import { useContextoPaginaAventura } from 'Contextos/ContextoPaginaAventura/contexto';

import PlayerYouTube from 'Componentes/ElementosVisuais/PlayerYouTube/PlayerYouTube';
import { ContainerFragmentoAssistindoSessao } from './componentes';

export function TrailerGrupoAventura() {
    const { grupoAventuraSelecionado } = useContextoPaginaAventura();

    return (
        <ContainerFragmentoAssistindoSessao className={styles.recipiente_trailer}>
            <PlayerYouTube urlSufixo={grupoAventuraSelecionado.gruposAventura![0].linkTrailerYoutube.sufixo} />
        </ContainerFragmentoAssistindoSessao>
    );
}