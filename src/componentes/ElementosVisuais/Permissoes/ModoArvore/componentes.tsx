'use client';

import styles from './styles.module.css';

import type { ArvoreItensPermissaoDto, ItemPermissaoDto } from 'types-nora-api';

import { type Depth, ItemPermissaoWidget } from 'Componentes/ElementosVisuais/Permissoes/componentes';

type NodePermissao = ArvoreItensPermissaoDto['tree'][number];

export default function PermissoesModoArvore({ arvore, onFocoItem, getAcessoLeaf }: { arvore: NodePermissao[]; onFocoItem: (idItem: number) => void; getAcessoLeaf?: (item: ItemPermissaoDto) => boolean; }) {
    return (
        <div className={styles.arvore}>
            {arvore.map((n) => <NoPermissao key={n.id} node={n} depth={0} onFocoItem={onFocoItem} getAcessoLeaf={getAcessoLeaf} />)}
        </div>
    );
};

function NoPermissao({ node, depth, onFocoItem, getAcessoLeaf }: { node: NodePermissao; depth: number; onFocoItem: (idItem: number) => void; getAcessoLeaf?: (item: ItemPermissaoDto) => boolean; }) {
    const children = node.children || [];
    const hasChildren = children.length > 0;
    const safeDepth = ((depth > 10 ? 10 : depth) as Depth);
    const acessoLeaf = getAcessoLeaf ? getAcessoLeaf(node) : undefined;

    if (!hasChildren) return <ItemPermissaoWidget item={node} depth={safeDepth} isExpandable={false} disableHover={false} showFocoButton onFoco={() => onFocoItem(node.id)} modo="linha" isLeaf acessoLeaf={acessoLeaf} />;

    return (
        <details className={styles.details}>
            <summary className={styles.summary}>
                <ItemPermissaoWidget item={node} depth={safeDepth} isExpandable disableHover={false} showFocoButton onFoco={() => onFocoItem(node.id)} modo="linha" isLeaf={false} />
            </summary>

            <div className={styles.filhos}>
                {children.map((c) => <NoPermissao key={c.id} node={c} depth={depth + 1} onFocoItem={onFocoItem} getAcessoLeaf={getAcessoLeaf} />)}
            </div>
        </details>
    );
};