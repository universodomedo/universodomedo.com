import styles from './styles.module.css';

import { PAGINAS } from "types-nora-api";

import { ControladorSlot } from "Layouts/ControladorSlot";
import { ContextoArvoreItensPermissoesProvider, useContextoArvoreItensPermissoes } from "Contextos/ContextoArvoreItensPermissoes/contexto";
import { ContextoPaginaPermissoesUsuariosProvider, useContextoPaginaPermissoesUsuarios } from "Contextos/ContextoPaginaPermissoesUsuarios/contexto";
import { ContextoPaginaPermissoesProvider, useContextoPaginaPermissoes } from 'Contextos/ContextoPaginaPermissoes/contexto';
import { ContextoAcessoDeUsuarioEmItemProvider, useContextoAcessoDeUsuarioEmItem } from 'Contextos/ContextoAcessoDeUsuarioEmItem/contexto';
import SelecionadorUsuarioEmCache from "Componentes/Elementos/Inputs/Selecionadores/SelecionadorUsuarioEmCache/SelecionadorUsuarioEmCache";
import { JanelaArvorePermissoes } from 'Componentes/ElementosVisuais/Permissoes/subcomponentes';
import PermissoesModoFoco from 'Componentes/ElementosVisuais/Permissoes/ModoFoco/componentes';
import { BotaoTelaPermissoes } from 'Componentes/ElementosVisuais/Permissoes/componentes';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/page';

export function PaginaAdmin_PermissoesUsuarios_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.dashboardPermissoesUsuarios}>
            <ContextoArvoreItensPermissoesProvider>
                <ContextoPaginaPermissoesUsuariosProvider>
                    <PaginaAdmin_PermissoesUsuarios_Contexto />
                </ContextoPaginaPermissoesUsuariosProvider>
            </ContextoArvoreItensPermissoesProvider>
        </ControladorSlot>
    );
};

function PaginaAdmin_PermissoesUsuarios_Contexto() {
    const { usuarioSelecionado } = useContextoPaginaPermissoesUsuarios();

    return !usuarioSelecionado
        ? <ModoBuscaUsuario />
        : <ContextoPaginaPermissoesProvider><ContextoAcessoDeUsuarioEmItemProvider><ModoUsuarioSelecionado /></ContextoAcessoDeUsuarioEmItemProvider></ContextoPaginaPermissoesProvider>
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
    const { arvorePermissoes } = useContextoArvoreItensPermissoes();
    const { usuarioSelecionado } = useContextoPaginaPermissoesUsuarios();
    const { secaoGalhoItemAtual, selecionaIdItem, deselecionaItemSelecionado } = useContextoPaginaPermissoes();
    const { temAcessoLeaf, solicitaAlteracaoAcesso } = useContextoAcessoDeUsuarioEmItem();
    if (!usuarioSelecionado) return null;

    return (
        <div className={styles.recipiente_usuario_selecionado}>
            <HeaderUsuarioSelecionado />
            <div className={styles.conteudo_usuario_selecionado}>
                {!secaoGalhoItemAtual
                    ? <JanelaArvorePermissoes arvore={arvorePermissoes.tree} onFocoItem={idItem => selecionaIdItem(idItem)} getAcessoLeaf={temAcessoLeaf} />
                    : <PermissoesModoFoco secaoGalhoItemAtual={secaoGalhoItemAtual} onFocoItem={idItem => selecionaIdItem(idItem)} onVoltar={() => deselecionaItemSelecionado()} getAcessoLeaf={temAcessoLeaf} renderAcaoItem={(item) => (
                        <div className={styles.detalhes_acesso}>
                            <BotaoTelaPermissoes onClick={() => solicitaAlteracaoAcesso(item.id)}>Alterar Acesso</BotaoTelaPermissoes>
                        </div>
                    )} />
                }
            </div>
        </div>
    );
};

export function HeaderUsuarioSelecionado() {
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
                <BotaoTelaPermissoes className={styles.botao} onClick={() => selecionaIdUsuario(null)}>Trocar usuário</BotaoTelaPermissoes>
            </div>
        </div>
    );
};