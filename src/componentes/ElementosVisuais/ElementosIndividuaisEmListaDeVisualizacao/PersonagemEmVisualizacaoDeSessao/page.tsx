import styles from './styles.module.css';

import { PathTokenPadrao, SalaDeJogo_JogadorDto, TipoVinculoSessaoJogador, UsuarioVisualizacaoSimplesDto } from 'types-nora-api';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { AvatarUsuarioEmVisualizacao_CACHED } from '../AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';

type PersonagemEmVisualizacaoDeSessaoProps = | { tipo: 'mestre'; usuario: UsuarioVisualizacaoSimplesDto; } | { tipo: 'participante'; participanteSessao: SalaDeJogo_JogadorDto; };

export default function PersonagemEmVisualizacaoDeSessao(props: PersonagemEmVisualizacaoDeSessaoProps) {
    let render = <></>;

    if (props.tipo === 'mestre') render = <AvatarUsuarioEmVisualizacao_CACHED idUsuario={props.usuario.id} avatarUsuarioMini/>
    else if (props.participanteSessao.tipoVinculoSessaoJogador === TipoVinculoSessaoJogador.PERSONAGEM) render = <RecipienteImagem src={props.participanteSessao.personagemDoJogador.caminhoAvatar} />;
    else render = (
        <>
            <RecipienteImagem src={PathTokenPadrao} />
            <AvatarUsuarioEmVisualizacao_CACHED idUsuario={props.participanteSessao.usuario.id} avatarUsuarioMini/>
        </>
    );

    return (
        <div className={styles.recipiente_imagem_avatar}>
            {render}
        </div>
    );
};