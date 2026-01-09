'use client';

import styles from './styles.module.css';

import type React from 'react';
import { ItemPermissaoDto } from 'types-nora-api';

export type Depth = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export function Botao({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) { return <button className={styles.botao} disabled={disabled} onClick={onClick}>{children}</button>; };

export function FooterAcoes({ modo, onVoltar, onNova }: { modo: 'arvore' | 'foco'; onVoltar?: () => void; onNova: () => void }) {
    return (
        <div className={styles.footer_acoes}>
            {modo === 'foco' ? <Botao onClick={() => onVoltar?.()}>Voltar</Botao> : null}
            <Botao onClick={() => onNova()}>Nova Permissão</Botao>
        </div>
    );
};

export function ItemPermissaoWidget({ item, depth, isExpandable, disableHover, showFocoButton, onFoco, modo, }: { item: ItemPermissaoDto; depth: Depth; isExpandable: boolean; disableHover: boolean; showFocoButton: boolean; onFoco: () => void; modo: 'linha' | 'card' | 'card-destaque'; }) {
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
                    <button className={styles.botao_selecionar} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFoco(); }}>Foco</button>
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