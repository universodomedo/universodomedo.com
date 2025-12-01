import styles from './styles.module.css';

import { ReactNode } from 'react';
import { PathTokenPadrao, UsuarioDto } from 'types-nora-api';

import { ParticipanteSessao } from "Adaptadores/SessaoDadosGerais";
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

type PersonagemEmVisualizacaoDeSessaoProps = | { tipo: 'mestre'; usuario: UsuarioDto; } | { tipo: 'participante'; participanteSessao: ParticipanteSessao; };

export default function PersonagemEmVisualizacaoDeSessao(props: PersonagemEmVisualizacaoDeSessaoProps) {
    let render = <></>;

    if (props.tipo === 'mestre') render = <RecipienteImagem src={props.usuario.customizacao.caminhoAvatar} />;
    else if (props.participanteSessao.personagem) render = <RecipienteImagem src={props.participanteSessao.personagem.caminhoAvatar} />;
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