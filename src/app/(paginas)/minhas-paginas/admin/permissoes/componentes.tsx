'use client';

import styles from './styles.module.css';
import { ArvoreItensPermissaoDto, ItemPermissaoDto } from 'types-nora-api';
import { useContextoPaginaPermissoes } from 'Contextos/ContextoPaginaPermissoes/contexto';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/page';

type NodePermissao = ArvoreItensPermissaoDto['tree'][number];
type Depth = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export function PaginaAdmin_Permissoes_Contexto() {
    const { itemSelecionado } = useContextoPaginaPermissoes();
    return itemSelecionado ? <ModoFoco /> : <ModoArvoreCompleta />;
}

function ModoArvoreCompleta() {
    const { arvorePermissoes } = useContextoPaginaPermissoes();

    return (
        <div className={styles.recipiente}>
            <div className={styles.janela_lista} data-scrollable data-visibility-mode="sempreVisivel">
                <ArvorePermissoes tree={arvorePermissoes.tree} />
            </div>

            <FooterAcoes modo="arvore" />
        </div>
    );
}

function ModoFoco() {
    const { itemSelecionado, itemPaiSelecionado, filhosItemSelecionado, selecionaIdItem, deselecionaItemSelecionado, solicitaCriacaoDePermissao } = useContextoPaginaPermissoes();
    if (!itemSelecionado) return null;

    return (
        <div className={styles.recipiente}>
            <div className={styles.foco}>
                <BlocoFoco titulo="Pai">
                    {itemPaiSelecionado ? (
                        <ItemPermissaoWidget
                            item={itemPaiSelecionado}
                            depth={0}
                            hasChildren={(itemPaiSelecionado.childrenCount || 0) > 0}
                            isExpandable={false}
                            disableHover
                            showFocoButton
                            onFoco={() => selecionaIdItem(itemPaiSelecionado.id)}
                            modo="card"
                        />
                    ) : (
                        <TextoVazio texto="RAIZ" />
                    )}
                </BlocoFoco>

                <BlocoFoco titulo="Selecionado">
                    <ItemPermissaoWidget
                        item={itemSelecionado}
                        depth={0}
                        hasChildren={(itemSelecionado.childrenCount || 0) > 0}
                        isExpandable={false}
                        disableHover
                        showFocoButton={false}
                        onFoco={() => { }}
                        modo="card-destaque"
                    />

                    <DetalhesItemSelecionado />
                </BlocoFoco>

                <BlocoFoco titulo="Filhos">
                    {filhosItemSelecionado.length ? (
                        <div className={styles.lista_filhos} data-scrollable data-visibility-mode="sempreVisivel">
                            {filhosItemSelecionado.map((i) => (
                                <ItemPermissaoWidget
                                    key={i.id}
                                    item={i}
                                    depth={0}
                                    hasChildren={(i.childrenCount || 0) > 0}
                                    isExpandable={false}
                                    disableHover
                                    showFocoButton
                                    onFoco={() => selecionaIdItem(i.id)}
                                    modo="linha"
                                />
                            ))}
                        </div>
                    ) : (
                        <TextoVazio texto="(sem filhos)" />
                    )}
                </BlocoFoco>
            </div>

            <FooterAcoes modo="foco" onVoltar={deselecionaItemSelecionado} />
        </div>
    );
}

function DetalhesItemSelecionado() {
    const { itemSelecionado, solicitaCriacaoDePermissao } = useContextoPaginaPermissoes();
    if (!itemSelecionado) return null;

    return (itemSelecionado.listaIdsUsuariosPermitidos || []).length > 0
        ? <DetalhesItemSelecionado_Capacidade itemSelecionado={itemSelecionado}/>
        : <DetalhesItemSelecionado_Folha itemSelecionado={itemSelecionado} solicitaCriacaoDePermissao={solicitaCriacaoDePermissao} />;
};

function DetalhesItemSelecionado_Capacidade({ itemSelecionado }: { itemSelecionado: ItemPermissaoDto }) {
    return (
        <div className={styles.detalhes_usuarios}>
            {itemSelecionado?.listaIdsUsuariosPermitidos.length > 0
                ? itemSelecionado.listaIdsUsuariosPermitidos.map(idUsuarioPermitido => <div key={idUsuarioPermitido} className={styles.avatar_usuario_permitido}><AvatarUsuarioEmVisualizacao_CACHED idUsuario={idUsuarioPermitido} /></div>)
                : <div className={styles.detalhes_usuarios_mensagem}>Nenhum Usuário permitido</div>
            }
        </div>
    );
};

function DetalhesItemSelecionado_Folha({ itemSelecionado, solicitaCriacaoDePermissao }: { itemSelecionado: ItemPermissaoDto; solicitaCriacaoDePermissao: (parentId: number | null) => void; }) {
    return (
        <div className={styles.acoes_foco}>
            <button className={styles.botao} onClick={() => solicitaCriacaoDePermissao(itemSelecionado.id)}>Adicionar filho</button>
        </div>
    );
};

function FooterAcoes({ modo, onVoltar }: { modo: 'arvore' | 'foco'; onVoltar?: () => void }) {
    const { solicitaCriacaoDePermissao } = useContextoPaginaPermissoes();

    return (
        <div className={styles.footer_acoes}>
            {modo === 'foco' ? <button className={styles.botao} onClick={() => onVoltar?.()}>Voltar</button> : null}
            <button className={styles.botao} onClick={() => solicitaCriacaoDePermissao(null)}>Nova Permissão</button>
        </div>
    );
}

function ArvorePermissoes({ tree }: { tree: NodePermissao[] }) {
    return (
        <div className={styles.arvore}>
            {tree.map((n) => <NoPermissao key={n.id} node={n} depth={0} />)}
        </div>
    );
}

function NoPermissao({ node, depth }: { node: NodePermissao; depth: number }) {
    const { selecionaIdItem } = useContextoPaginaPermissoes();

    const hasChildren = (node.children || []).length > 0;
    const safeDepth = (depth > 10 ? 10 : depth) as Depth;

    if (!hasChildren) {
        return (
            <ItemPermissaoWidget
                item={node as any}
                depth={safeDepth}
                hasChildren={false}
                isExpandable={false}
                disableHover={false}
                showFocoButton
                onFoco={() => selecionaIdItem(node.id)}
                modo="linha"
            />
        );
    }

    return (
        <details className={styles.details}>
            <summary className={styles.summary}>
                <ItemPermissaoWidget
                    item={node as any}
                    depth={safeDepth}
                    hasChildren
                    isExpandable
                    disableHover={false}
                    showFocoButton
                    onFoco={() => selecionaIdItem(node.id)}
                    modo="linha"
                />
            </summary>

            <div className={styles.filhos}>
                {node.children.map((c) => <NoPermissao key={c.id} node={c} depth={depth + 1} />)}
            </div>
        </details>
    );
}

function ItemPermissaoWidget({
    item,
    depth,
    hasChildren,
    isExpandable,
    disableHover,
    showFocoButton,
    onFoco,
    modo,
}: {
    item: ItemPermissaoDto;
    depth: Depth;
    hasChildren: boolean;
    isExpandable: boolean;
    disableHover: boolean;
    showFocoButton: boolean;
    onFoco: () => void;
    modo: 'linha' | 'card' | 'card-destaque';
}) {
    const depthClass = styles[`depth_${depth}`];
    const classeModo = modo === 'linha' ? styles.item_linha : (modo === 'card-destaque' ? styles.item_card_destaque : styles.item_card);
    const classeExpandivel = isExpandable ? styles.tem_filhos : '';
    const classeSemHover = disableHover ? styles.sem_hover_linha : '';

    return (
        <div className={`${styles.item_base} ${classeModo} ${depthClass} ${classeExpandivel} ${classeSemHover}`} role="group">
            <div className={styles.item_conteudo}>
                <div className={styles.item_textos}>
                    <div className={styles.item_codigo}>{item.codigo}</div>
                    <div className={styles.item_descricao}>{item.descricao}</div>
                    <div className={styles.item_path}>{item.path}</div>
                </div>
            </div>

            <div className={styles.item_acoes}>
                <div className={styles.item_tags}>
                    {item.isLockedLeaf ? <span className={styles.tag_travado}>Travado ({item.listaIdsUsuariosPermitidos.length})</span> : <span className={styles.tag_livre}>Livre</span>}
                    <span className={styles.tag_filhos}>Filhos: {item.childrenCount}</span>
                </div>

                {showFocoButton ? (
                    <button className={styles.botao_selecionar} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFoco(); }}>
                        Foco
                    </button>
                ) : null}
            </div>
        </div>
    );
}

function BlocoFoco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
    return (
        <div className={styles.foco_bloco}>
            <div className={styles.foco_titulo}>{titulo}</div>
            <div className={styles.foco_conteudo}>{children}</div>
        </div>
    );
}

function TextoVazio({ texto }: { texto: string }) { return <div className={styles.vazio}>{texto}</div>; }