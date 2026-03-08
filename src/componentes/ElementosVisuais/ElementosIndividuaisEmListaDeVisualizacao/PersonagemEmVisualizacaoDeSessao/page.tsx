import styles from './styles.module.css';

import { ParticipanteSessao, PathTokenPadrao, UsuarioDto } from 'types-nora-api';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

type PersonagemEmVisualizacaoDeSessaoProps = | { tipo: 'mestre'; usuario: UsuarioDto; } | { tipo: 'participante'; participanteSessao: ParticipanteSessao; };

export default function PersonagemEmVisualizacaoDeSessao(props: PersonagemEmVisualizacaoDeSessaoProps) {
    let render = <></>;

    if (props.tipo === 'mestre') render = <RecipienteImagem src={props.usuario.customizacao.caminhoAvatar} />;
    // to do
    // else if (props.participanteSessao.dadosParticipanteJogo.personagem) render = <RecipienteImagem src={props.participanteSessao.dadosParticipanteJogo.personagem.caminhoAvatar} />;
    else render = (
        <>
            <RecipienteImagem src={PathTokenPadrao} />
            <RecipienteImagem className={styles.avatar_usuario} src={props.participanteSessao.jogador?.customizacao.caminhoAvatar} />
        </>
    );

    return (
        <div className={styles.recipiente_imagem_avatar}>
            {render}
        </div>
    );
};