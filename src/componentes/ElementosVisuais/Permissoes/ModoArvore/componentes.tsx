'use client';

import styles from './styles.module.css';

import type { ArvoreItensPermissaoDto, ItemPermissaoDto } from 'types-nora-api';

import { type Depth, ItemPermissaoWidget } from 'Componentes/ElementosVisuais/Permissoes/componentes';

type NodePermissao = ArvoreItensPermissaoDto['tree'][number];

export default function PermissoesModoArvore({ tree, onFocoItem }: { tree: NodePermissao[]; onFocoItem: (idItem: number) => void }) {
    return (
        <div className={styles.arvore}>
            {tree.map((n) => <NoPermissao key={n.id} node={n} depth={0} onFocoItem={onFocoItem} />)}
        </div>
    );
};

function NoPermissao({ node, depth, onFocoItem }: { node: NodePermissao; depth: number; onFocoItem: (idItem: number) => void }) {
    const children = node.children || [];
    const hasChildren = children.length > 0;
    const safeDepth = ((depth > 10 ? 10 : depth) as Depth);

    if (!hasChildren) return <ItemPermissaoWidget item={node as ItemPermissaoDto} depth={safeDepth} isExpandable={false} disableHover={false} showFocoButton onFoco={() => onFocoItem(node.id)} modo="linha" />;

    return (
        <details className={styles.details}>
            <summary className={styles.summary}>
                <ItemPermissaoWidget item={node as ItemPermissaoDto} depth={safeDepth} isExpandable disableHover={false} showFocoButton onFoco={() => onFocoItem(node.id)} modo="linha" />
            </summary>

            <div className={styles.filhos}>
                {children.map((c) => <NoPermissao key={c.id} node={c} depth={depth + 1} onFocoItem={onFocoItem} />)}
            </div>
        </details>
    );
};