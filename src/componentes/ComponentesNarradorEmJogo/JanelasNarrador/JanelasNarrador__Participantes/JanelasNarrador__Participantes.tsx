import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import styles from './styles.module.css';

import { VIEW_JogadorDeSessao } from 'types-nora-api';

export default function JanelasNarrador__Participantes({ participantesDaSessao }: { participantesDaSessao: VIEW_JogadorDeSessao[]; }) {
    return (
        <div className={styles.recipiente_participantes_sala_de_jogo}>
            {participantesDaSessao.map((participante, index) => <RenderParticipanteSessao key={index} participante={participante} />)}
        </div>
    );
};

function RenderParticipanteSessao({ participante }: { participante: VIEW_JogadorDeSessao; }) {
    return (
        <div className={styles.recipiente_conteudo_janela_participantes}>
            <div className={styles.recipiente_participante_sala_de_jogo}>
                <h2>{participante.usernameUsuario}</h2>
                <div className={styles.recipiente_avatar_participante_sala_de_jogo}>
                    <RecipienteImagem src={participante.caminhoAvatar} />
                </div>
                <h2>{participante.nomeParticipante}</h2>
            </div>
            <hr />
            <div className={styles.recipiente_executador_de_acao}>
                <button>Teste</button>
            </div>
        </div>
    );
};