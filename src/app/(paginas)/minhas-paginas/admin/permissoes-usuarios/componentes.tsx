import styles from './styles.module.css';

import { useContextoPaginaPermissoesUsuarios } from "Contextos/ContextoPaginaPermissoesUsuarios/contexto";
import SelecionadorUsuarioEmCache from "Componentes/Elementos/Inputs/Selecionadores/SelecionadorUsuarioEmCache/SelecionadorUsuarioEmCache";
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/page';

export function PaginaAdmin_PermissoesUsuarios_Contexto() {
    const { usuarioSelecionado } = useContextoPaginaPermissoesUsuarios();

    return !usuarioSelecionado
        ? <ModoBuscaUsuario />
        : <ModoUsuarioSelecionado />
};

function ModoBuscaUsuario() {
    const { selecionaIdUsuario } = useContextoPaginaPermissoesUsuarios();

    return (
        <div className={styles.recipiente_busca_usuarios}>
            <SelecionadorUsuarioEmCache onSelectIdUsuario={idUsuario => selecionaIdUsuario(idUsuario)} />
        </div>
    );
};

function ModoUsuarioSelecionado() {
    const { usuarioSelecionado } = useContextoPaginaPermissoesUsuarios();
    if (!usuarioSelecionado) return null;

    return (
        <div className={styles.recipiente_usuario_selecionado}>
            <HeaderUsuarioSelecionado />
            <div className={styles.conteudo_usuario_selecionado}>
                <h3>ModoUsuarioSelecionado</h3>
            </div>
        </div>
    );
};

function HeaderUsuarioSelecionado() {
    const { usuarioSelecionado, selecionaIdUsuario } = useContextoPaginaPermissoesUsuarios();
    if (!usuarioSelecionado) return null;

    return (
        <div className={styles.header_usuario}>
            <div className={styles.header_usuario_esquerda}>
                <div className={styles.header_usuario_avatar}>
                    <AvatarUsuarioEmVisualizacao_CACHED idUsuario={usuarioSelecionado.id} />
                </div>

                <div className={styles.header_usuario_textos}>
                    <div className={styles.header_usuario_titulo}>Usuário selecionado</div>
                    <div className={styles.header_usuario_nome}>{usuarioSelecionado.username}</div>
                    <div className={styles.header_usuario_id}>#{usuarioSelecionado.id}</div>
                </div>
            </div>

            <div className={styles.header_usuario_direita}>
                <button className={styles.botao} onClick={() => selecionaIdUsuario(null)}>Trocar usuário</button>
            </div>
        </div>
    );
};