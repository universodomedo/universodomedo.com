'use client';

import styles from './styles.module.css';

import type { ItemPermissaoDto } from 'types-nora-api';

import { useContextoPaginaPermissoes } from 'Contextos/ContextoPaginaPermissoes/contexto';
import { useContextoArvoreItensPermissoes } from 'Contextos/ContextoArvoreItensPermissoes/contexto';
import PermissoesModoArvore from 'Componentes/ElementosVisuais/Permissoes/ModoArvore/componentes';
import PermissoesModoFoco from 'Componentes/ElementosVisuais/Permissoes/ModoFoco/componentes';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/page';

export function PaginaAdmin_Permissoes_Contexto() {
    const { itemSelecionado } = useContextoPaginaPermissoes();
    return itemSelecionado ? <ModoFoco /> : <ModoArvoreCompleta />;
}

function ModoArvoreCompleta() {
    const { arvorePermissoes } = useContextoArvoreItensPermissoes();
    const { selecionaIdItem, solicitaCriacaoDePermissao } = useContextoPaginaPermissoes();

    return (
        <div className={styles.recipiente}>
            {/* tem q trazer useScrollable para janela_lista */}
            <div className={styles.janela_lista}>
                <PermissoesModoArvore tree={arvorePermissoes.tree} onFocoItem={idItem => selecionaIdItem(idItem)} />
            </div>

            <div className={styles.footer_acoes}>
                <button className={styles.botao} onClick={() => solicitaCriacaoDePermissao(null)}>Nova Permissão</button>
            </div>
        </div>
    );
}

function ModoFoco() {
    const { itemSelecionado, itemPaiSelecionado, filhosItemSelecionado, selecionaIdItem, deselecionaItemSelecionado, solicitaCriacaoDePermissao } = useContextoPaginaPermissoes();
    if (!itemSelecionado) return null;

    return (
        <PermissoesModoFoco
            itemSelecionado={itemSelecionado}
            itemPaiSelecionado={itemPaiSelecionado}
            filhosItemSelecionado={filhosItemSelecionado}
            onFocoItem={(idItem) => selecionaIdItem(idItem)}
            onVoltar={() => deselecionaItemSelecionado()}
            renderDetalhesSelecionado={<DetalhesItemSelecionado />}
            renderFooterDireita={<button className={styles.botao} onClick={() => solicitaCriacaoDePermissao(null)}>Nova Permissão</button>}
        />
    );
}

function DetalhesItemSelecionado() {
    const { itemSelecionado, solicitaCriacaoDePermissao } = useContextoPaginaPermissoes();
    if (!itemSelecionado) return null;

    return (itemSelecionado.listaIdsUsuariosPermitidos || []).length > 0
        ? <DetalhesItemSelecionado_Capacidade itemSelecionado={itemSelecionado} />
        : <DetalhesItemSelecionado_Folha itemSelecionado={itemSelecionado} solicitaCriacaoDePermissao={solicitaCriacaoDePermissao} />;
}

function DetalhesItemSelecionado_Capacidade({ itemSelecionado }: { itemSelecionado: ItemPermissaoDto }) {
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

function DetalhesItemSelecionado_Folha({ itemSelecionado, solicitaCriacaoDePermissao }: { itemSelecionado: ItemPermissaoDto; solicitaCriacaoDePermissao: (parentId: number | null) => void }) {
    return (
        <div className={styles.acoes_foco}>
            <button className={styles.botao} onClick={() => solicitaCriacaoDePermissao(itemSelecionado.id)}>Adicionar filho</button>
        </div>
    );
};