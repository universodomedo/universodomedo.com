'use client';

import styles from './styles.module.css';

import { useContextoPaginaPermissoes } from 'Contextos/ContextoPaginaPermissoes/contexto';
import { useContextoArvoreItensPermissoes } from 'Contextos/ContextoArvoreItensPermissoes/contexto';
import { JanelaArvorePermissoes } from 'Componentes/ElementosVisuais/Permissoes/subcomponentes';
import PermissoesModoFoco from 'Componentes/ElementosVisuais/Permissoes/ModoFoco/componentes';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/page';
import { BotaoTelaPermissoes } from 'Componentes/ElementosVisuais/Permissoes/componentes';

export function PaginaAdmin_Permissoes_Contexto() {
    const { secaoGalhoItemAtual } = useContextoPaginaPermissoes();
    return secaoGalhoItemAtual ? <ModoFoco /> : <ModoArvoreCompleta />;
}

function ModoArvoreCompleta() {
    const { arvorePermissoes } = useContextoArvoreItensPermissoes();
    const { selecionaIdItem, solicitaCriacaoDePermissao } = useContextoPaginaPermissoes();

    return (
        <div className={styles.recipiente}>
            <JanelaArvorePermissoes arvore={arvorePermissoes.tree} onFocoItem={idItem => selecionaIdItem(idItem)} />

            <div className={styles.footer_acoes}>
                <BotaoTelaPermissoes className={styles.botao} onClick={() => solicitaCriacaoDePermissao(null)}>Nova Permissão</BotaoTelaPermissoes>
            </div>
        </div>
    );
};

function ModoFoco() {
    const { secaoGalhoItemAtual, selecionaIdItem, deselecionaItemSelecionado, solicitaCriacaoDePermissao } = useContextoPaginaPermissoes();
    if (!secaoGalhoItemAtual) return null;

    return (
        <div className={styles.recipiente_externo_foco}>
            <PermissoesModoFoco secaoGalhoItemAtual={secaoGalhoItemAtual} onFocoItem={idItem => selecionaIdItem(idItem)} onVoltar={() => deselecionaItemSelecionado()} renderDetalhesSelecionado={<DetalhesItemSelecionado />} renderFooterDireita={<BotaoTelaPermissoes className={styles.botao} onClick={() => solicitaCriacaoDePermissao(null)}>Nova Permissão</BotaoTelaPermissoes>} />
        </div>
    );
}

function DetalhesItemSelecionado() {
    const { secaoGalhoItemAtual } = useContextoPaginaPermissoes();
    if (!secaoGalhoItemAtual) return null;

    return (secaoGalhoItemAtual.itemSelecionado.listaIdsUsuariosPermitidos || []).length > 0 ? <DetalhesItemSelecionado_Capacidade /> : <DetalhesItemSelecionado_Folha />;
};

function DetalhesItemSelecionado_Capacidade() {
    const { secaoGalhoItemAtual } = useContextoPaginaPermissoes();
    if (!secaoGalhoItemAtual) return null;

    const itemSelecionado = secaoGalhoItemAtual.itemSelecionado;

    return (
        <div className={styles.detalhes_usuarios}>
            {itemSelecionado.listaIdsUsuariosPermitidos.length > 0
                ? itemSelecionado.listaIdsUsuariosPermitidos.map((idUsuarioPermitido) => (
                    <div key={idUsuarioPermitido} className={styles.avatar_usuario_permitido}>
                        <AvatarUsuarioEmVisualizacao_CACHED idUsuario={idUsuarioPermitido} />
                    </div>
                ))
                : <div className={styles.detalhes_usuarios_mensagem}>Nenhum Usuário permitido</div>
            }
        </div>
    );
}

function DetalhesItemSelecionado_Folha() {
    const { secaoGalhoItemAtual, solicitaCriacaoDePermissao } = useContextoPaginaPermissoes();
    if (!secaoGalhoItemAtual) return null;

    return (
        <div className={styles.acoes_foco}>
            <BotaoTelaPermissoes className={styles.botao} onClick={() => solicitaCriacaoDePermissao(secaoGalhoItemAtual.itemSelecionado.id)}>Adicionar filho</BotaoTelaPermissoes>
        </div>
    );
};