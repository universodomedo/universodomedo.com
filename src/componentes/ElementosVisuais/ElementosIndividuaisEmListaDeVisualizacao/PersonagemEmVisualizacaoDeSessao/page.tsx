import styles from './styles.module.css';

import { PathAvatarPadrao, SalaDeJogo_JogadorDto, TipoVinculoSessaoJogador, UsuarioVisualizacaoSimplesDto } from 'types-nora-api';

import { RenderArquivoAvatar } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';
import { AvatarUsuarioEmVisualizacao_CACHED } from '../AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';

type PersonagemEmVisualizacaoDeSessaoProps = | { tipo: 'mestre'; usuario: UsuarioVisualizacaoSimplesDto; } | { tipo: 'participante'; participanteSessao: SalaDeJogo_JogadorDto; };

export default function PersonagemEmVisualizacaoDeSessao(props: PersonagemEmVisualizacaoDeSessaoProps) {
    let render = <></>;

    if (props.tipo === 'mestre') render = <AvatarUsuarioEmVisualizacao_CACHED idUsuario={props.usuario.id}/>
    else if (props.participanteSessao.tipoVinculoSessaoJogador === TipoVinculoSessaoJogador.PERSONAGEM) render = <RenderArquivoAvatar caminhoArquivoAvatar={props.participanteSessao.personagemDoJogador.avatarAtual} />;
    else render = (
        <>
            <RenderArquivoAvatar caminhoArquivoAvatar={PathAvatarPadrao} />
            <AvatarUsuarioEmVisualizacao_CACHED idUsuario={props.participanteSessao.usuario.id} avatarUsuarioMini/>
        </>
    );

    return (
        <div className={styles.recipiente_imagem_avatar}>
            {render}
        </div>
    );
};