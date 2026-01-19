'use client';

import styles from './styles.module.css';

import React, { JSX, useMemo } from 'react';
import { type MenuNode, filtrarMenuPorAcesso } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';

export default function MenuInterno({ itens }: { itens: readonly MenuNode[] }) {
    const { estaAutenticado, verificarCapacidade, cadastroPermitido } = useContextoAutenticacao();
    const itensFiltrados = useMemo(() => filtrarMenuPorAcesso(itens, { estaAutenticado, verificarCapacidade, cadastroPermitido }), [itens, estaAutenticado, verificarCapacidade]);
    
    function RenderNode(node: MenuNode, key: string, depth: number): JSX.Element | null {
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

                    {/* 1º nível: NÃO embrulha em subitens (como você queria) */}
                    {filhos.map((sub, idx) => RenderNode(sub, `${key}-${idx}`, depth + 1))}
                </React.Fragment>
            );
        }

        return (
            <div key={key} className={styles.recipiente_item_lista_acoes}>
                <h2>{node.titulo}</h2>

                <div className={styles.recipiente_subitens_lista_acoes}>
                    {filhos.map((sub, idx) => RenderNode(sub, `${key}-${idx}`, depth + 1))}
                </div>
            </div>
        );
    }

    return (
        <div id={styles.recipiente_lista_acoes}>
            {itensFiltrados.map((node, index) => {
                const rendered = RenderNode(node, `${index}`, 0);
                if (!rendered) return null;

                const next = itensFiltrados[index + 1];
                const deveDivisoria = next?.tipo === 'grupo';

                return (
                    <React.Fragment key={`root-${index}`}>
                        {rendered}
                        {deveDivisoria && <hr className={styles.divisor} />}
                    </React.Fragment>
                );
            })}
        </div>
    );
};