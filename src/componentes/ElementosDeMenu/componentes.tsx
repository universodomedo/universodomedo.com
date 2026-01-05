'use client';

import styles from './styles.module.css';
import React, { JSX } from 'react';
import { type MenuNode } from 'types-nora-api';

import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';

export default function MenuInterno({ itens }: { itens: readonly MenuNode[] }) {
    const raiz = itens ?? [];
    const idxGruposTopo = raiz.map((n, i) => (n.tipo === 'grupo' ? i : -1)).filter((i) => i >= 0);

    function RenderNode(node: MenuNode, key: string, depth: number, proximoGrupoTopoExiste: boolean): JSX.Element | null {
        if (node.tipo === 'item') {
            return (
                <div key={key} className={styles.recipiente_item_lista_acoes}>
                    <LinkInterno destino={node.destino}><h2>{node.titulo}</h2></LinkInterno>
                </div>
            );
        }

        const filhos = node.itens ?? [];
        if (filhos.length === 0) return null;

        if (depth === 0) {
            return (
                <React.Fragment key={key}>
                    <h2 className={styles.titulo_permissao}>{node.titulo}</h2>

                    {filhos.map((sub, idx) => RenderNode(sub, `${key}-${idx}`, depth + 1, false))}

                    {proximoGrupoTopoExiste && <hr className={styles.divisor} />}
                </React.Fragment>
            );
        }

        return (
            <div key={key} className={styles.recipiente_item_lista_acoes}>
                <h2>{node.titulo}</h2>

                <div className={styles.recipiente_subitens_lista_acoes}>
                    {filhos.map((sub, idx) => RenderNode(sub, `${key}-${idx}`, depth + 1, false))}
                </div>
            </div>
        );
    }

    return (
        <div id={styles.recipiente_lista_acoes}>
            {raiz.map((node, index) => {
                const ehGrupoTopo = node.tipo === 'grupo';
                const posNoArrayDeGrupos = ehGrupoTopo ? idxGruposTopo.indexOf(index) : -1;
                const proximoGrupoTopoExiste = ehGrupoTopo && posNoArrayDeGrupos >= 0 && posNoArrayDeGrupos < idxGruposTopo.length - 1;
                return RenderNode(node, `${index}`, 0, proximoGrupoTopoExiste);
            })}
        </div>
    );
};