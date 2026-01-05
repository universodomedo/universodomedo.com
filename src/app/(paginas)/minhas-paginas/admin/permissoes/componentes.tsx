'use client';

import styles from './styles.module.css';
import { ArvoreItensPermissaoDto } from 'types-nora-api';
import { useContextoPaginaPermissoes } from 'Contextos/ContextoPaginaPermissoes/contexto';

type NodePermissao = ArvoreItensPermissaoDto['tree'][number];

export function PaginaAdmin_Permissoes_Contexto() {
    const { itemSelecionado } = useContextoPaginaPermissoes();
    if (itemSelecionado !== null) return <div>TODO: modo foco</div>;
    return <ModoArvoreCompleta />;
}

function ModoArvoreCompleta() {
    const { arvorePermissoes, selecionaIdItem } = useContextoPaginaPermissoes();

    return (
        <>
            <HeaderArvore />
            <div className={styles.body}>
                <ArvorePermissoes tree={arvorePermissoes.tree} onSelect={(id) => selecionaIdItem(id)} />
            </div>
        </>
    );
}

function HeaderArvore() {
    return (
        <div className={styles.header}>
            <h1 className={styles.titulo}>Permissões</h1>
            <div className={styles.acoes}>
                <button className={styles.botao} onClick={() => console.log('TODO: criar nova raiz')}>Nova raiz</button>
            </div>
        </div>
    );
}

function ArvorePermissoes({ tree, onSelect }: { tree: NodePermissao[]; onSelect: (id: number) => void }) {
    return (
        <div className={styles.arvore}>
            {tree.map((n) => <NoPermissao key={n.id} node={n} onSelect={onSelect} />)}
        </div>
    );
}

function NoPermissao({ node, onSelect }: { node: NodePermissao; onSelect: (id: number) => void }) {
    const hasChildren = (node.children || []).length > 0;

    if (!hasChildren) {
        return (
            <div className={styles.noFolha} onClick={() => onSelect(node.id)} role="button" tabIndex={0}>
                <LinhaPermissao node={node} />
            </div>
        );
    }

    return (
        <details className={styles.details}>
            <summary className={styles.summary} onClick={() => onSelect(node.id)}>
                <LinhaPermissao node={node} />
            </summary>
            <div className={styles.filhos}>
                {node.children.map((c) => <NoPermissao key={c.id} node={c} onSelect={onSelect} />)}
            </div>
        </details>
    );
}

function LinhaPermissao({ node }: { node: NodePermissao }) {
    return (
        <div className={styles.linha}>
            <div className={styles.linhaEsquerda}>
                <div className={styles.codigo}>{node.codigo}</div>
                <div className={styles.descricao}>{node.descricao}</div>
                <div className={styles.path}>{node.path}</div>
            </div>

            <div className={styles.linhaDireita}>
                {node.isLockedLeaf ? <span className={styles.tagTravado}>Travado ({node.usedByUsersCount})</span> : <span className={styles.tagLivre}>Livre</span>}
                <span className={styles.tagFilhos}>Filhos: {node.childrenCount}</span>
            </div>
        </div>
    );
}