import styles from './styles.module.css';

import React, { JSX } from 'react';

import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';

export type NivelPermissao = { tituloPermissao: string; condicao: boolean; itens: ItemMenu[]; };
export type ItemMenu = { titulo: string; link?: string; subitens?: ItemMenu[]; };

export function RenderItensPermissoes(permissoes: NivelPermissao[], url: string, divisor: boolean, prefixo?: string) {
    return (
        <>
            {divisor && <hr className={styles.divisor} />}
            
            <div id={styles.recipiente_lista_acoes}>
                {permissoes.filter(nivel => nivel.condicao && nivel.itens.length > 0).map((nivel, indexPermissao, arrayFiltrada) => (
                    <React.Fragment key={indexPermissao}>
                        <h2 className={styles.titulo_permissao}>{nivel.tituloPermissao}</h2>
                        {nivel.itens.map((item, index) => RenderItemBase(item, `${index}`, url, prefixo))}
                        {indexPermissao < arrayFiltrada.length - 1 && <hr className={styles.divisor} />}
                    </React.Fragment>
                ))}
            </div>
        </>
    );
};

export function RenderItemBase(item: ItemMenu, key: string, url: string, prefixo?: string): JSX.Element {
    const temSubitens = item.subitens && item.subitens.length > 0;

    return (
        <div key={key} className={styles.recipiente_item_lista_acoes}>
            {item.link === undefined ? (
                <h2>{item.titulo}</h2>
            ) : (
                <CustomLink href={`${prefixo ?? ''}/${url}/${item.link}`}>
                    <h2>{item.titulo}</h2>
                </CustomLink>
            )}

            {temSubitens && (
                <div className={styles.recipiente_subitens_lista_acoes}>
                    {item.subitens!.map((sub, idx) => RenderItemBase(sub, `${key}-${idx}`, url, prefixo))}
                </div>
            )}
        </div>
    );
};