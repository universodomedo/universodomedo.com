'use client';

import styles from './styles.module.css';

import type React from 'react';
import { ItemPermissaoDto } from 'types-nora-api';

export type Depth = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export function BotaoTelaPermissoes({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) { return <button {...props} className={[styles.botao, props.className].filter(Boolean).join(' ')}>{children}</button>; };

export function FooterAcoes({ modo, onVoltar, onNova }: { modo: 'arvore' | 'foco'; onVoltar?: () => void; onNova: () => void }) {
    return (
        <div className={styles.footer_acoes}>
            {modo === 'foco' ? <BotaoTelaPermissoes onClick={() => onVoltar?.()}>Voltar</BotaoTelaPermissoes> : null}
            <BotaoTelaPermissoes onClick={() => onNova()}>Nova Permissão</BotaoTelaPermissoes>
        </div>
    );
};

export function ItemPermissaoWidget({ item, depth, isExpandable, disableHover, showFocoButton, onFoco, modo, isLeaf, acessoLeaf }: { item: ItemPermissaoDto; depth: Depth; isExpandable: boolean; disableHover: boolean; showFocoButton: boolean; onFoco: () => void; modo: 'linha' | 'card' | 'card-destaque'; isLeaf?: boolean; acessoLeaf?: boolean; }) {
    const depthClass = styles[`depth_${depth}`];
    const classeModo = modo === 'linha' ? styles.item_linha : (modo === 'card-destaque' ? styles.item_card_destaque : styles.item_card);
    const classeExpandivel = isExpandable ? styles.tem_filhos : '';
    const classeSemHover = disableHover ? styles.sem_hover_linha : '';
    const leaf = (typeof isLeaf === 'boolean') ? isLeaf : ((item.childrenCount || 0) === 0);
    const mostraTagAcesso = leaf && typeof acessoLeaf === 'boolean';

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
                    {mostraTagAcesso ? <span className={`${styles.tag_acesso_base} ${acessoLeaf ? styles.tag_acesso_sim : styles.tag_acesso_nao}`}>{acessoLeaf ? 'Com acesso' : 'Sem acesso'}</span> : null}
                    {item.isLockedLeaf ? <span className={styles.tag_travado}>Travado ({item.listaIdsUsuariosPermitidos.length})</span> : <span className={styles.tag_livre}>Livre</span>}
                    <span className={styles.tag_filhos}>Filhos: {item.childrenCount}</span>
                </div>

                {showFocoButton ? (
                    <BotaoTelaPermissoes className={styles.botao_selecionar} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFoco(); }}>Foco</BotaoTelaPermissoes>
                ) : null}
            </div>
        </div>
    );
};

export function TextoVazio({ texto }: { texto: string }) { return <div className={styles.vazio}>{texto}</div>; }

export function BlocoFoco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
    return (
        <div className={styles.foco_bloco}>
            <div className={styles.foco_titulo}>{titulo}</div>
            <div className={styles.foco_conteudo}>{children}</div>
        </div>
    );
};