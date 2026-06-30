'use client';

import styles from './styles.module.css';

import { type JSX } from 'react';
import { filtrarMenuRuntime, type MenuNodeRuntime } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import { useContextoNavegacaoRuntime } from 'Contextos/ContextoNavegacaoRuntime/contexto';
import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';
import RecipienteArquivoInterno from 'Uteis/ImagemLoader/RecipienteArquivoInterno';

const OPTS_ACESSO = { redirectNaoAutenticado: '/acessar', redirectSemCapacidade: '/' };

export function ItensMenuSwiperEsquerda() {
    const { estaAutenticado, verificarCapacidade, cadastroPermitido } = useContextoAutenticacao();
    const { config, indice } = useContextoNavegacaoRuntime();

    if (config === null || indice === null) return <div className={styles.recipiente_lista} />;

    const itens = filtrarMenuRuntime(config.menuPrincipal, indice, { estaAutenticado, verificarCapacidade, cadastroPermitido }, OPTS_ACESSO);

    return (
        <div className={styles.recipiente_lista}>
            {itens.map((item, index) => <RenderNode key={`${index}`} node={item} />)}
        </div>
    );
};

function RenderNode({ node }: { node: MenuNodeRuntime }): JSX.Element | null {
    if (node.tipo === 'item') {
        return (
            <div className={styles.item_menu}>
                <LinkInterno destino={{ paginaTemplate: node.paginaTemplate, params: node.params ?? undefined }} className={styles.conteudo_item_menu}><ConteudoItemLink titulo={node.titulo} /></LinkInterno>
            </div>
        );
    }

    if (node.itens.length === 0) return null;

    return (
        <div className={styles.item_menu}>
            <h3>{node.titulo}</h3>
            <div className={styles.recipiente_subitens}>
                {node.itens.map((sub, idx) => (<RenderNode key={`${node.titulo}-${idx}`} node={sub} />))}
            </div>
        </div>
    );
};

function ConteudoItemLink({ titulo }: { titulo: string }): JSX.Element {
    return (
        <>
            <h3>{titulo}</h3>
            <div className={styles.recipiente_icone_link}>
                <RecipienteArquivoInterno arquivo={'SIMBOLO_ITEM_MENU'} />
            </div>
        </>
    );
};
