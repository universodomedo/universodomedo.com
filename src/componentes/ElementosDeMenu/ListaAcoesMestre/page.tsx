import styles from '../styles.module.css';

import React, { JSX } from 'react';

import { verificarPermissao } from 'Helpers/verificarPermissao';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';

type NivelPermissaoMestre = {
    tituloPermissao: string;
    condicao: boolean;
    itens: ItemMenuMestre[];
};

type ItemMenuMestre = {
    titulo: string;
    link?: string;
    subitens?: ItemMenuMestre[];
};

export default function ListaAcoesMestre() {
    const permissoesMestre: NivelPermissaoMestre[] = [
        {
            tituloPermissao: 'Mestre',
            condicao: true,
            itens: [
                {
                    titulo: 'Início',
                    link: ''
                },
            ],
        },
        {
            tituloPermissao: 'Fragmento',
            condicao: !!verificarPermissao(usuario => usuario.perfilMestre.id >= 4),
            itens: [],
        },
        {
            tituloPermissao: 'Relíquia',
            condicao: !!verificarPermissao(usuario => usuario.perfilMestre.id >= 3),
            itens: [
                {
                    titulo: 'Aventuras',
                    subitens: [
                        {
                            titulo: 'Minhas Aventuras',
                            link: 'aventuras'
                        },
                        {
                            titulo: 'Rascunhos',
                            link: 'rascunhos/aventuras'
                        },
                    ],
                },
                {
                    titulo: 'Personagens',
                    link: 'personagens'
                },
            ],
        },
        {
            tituloPermissao: 'Criatura',
            condicao: !!verificarPermissao(usuario => usuario.perfilMestre.id >= 2),
            itens: [
                {
                    titulo: 'Sessões Únicas',
                    subitens: [
                        {
                            titulo: 'Minhas Sessões Únicas',
                            link: 'sessoes-unicas'
                        },
                        {
                            titulo: 'Rascunhos',
                            link: 'rascunhos/sessoes-unicas'
                        },
                    ],
                },
            ]
        },
    ];

    const renderItemMestre = (item: ItemMenuMestre, key: string): JSX.Element => {
        const temSubitens = item.subitens && item.subitens.length > 0;

        return (
            <div key={key} className={styles.recipiente_item_lista_acoes}>
                {item.link === undefined ? (
                    <h2>{item.titulo}</h2>
                ) : (
                    <CustomLink href={`/minhas-paginas/mestre/${item.link}`}>
                        <h2>{item.titulo}</h2>
                    </CustomLink>
                )}

                {temSubitens && (
                    <div className={styles.recipiente_subitens_lista_acoes}>
                        {item.subitens!.map((sub, idx) => renderItemMestre(sub, `${key}-${idx}`))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div id={styles.recipiente_lista_acoes}>
            {permissoesMestre.filter(nivel => nivel.condicao && nivel.itens.length > 0).map((nivel, indexPermissao, arrayFiltrada) => (
                <React.Fragment key={indexPermissao}>
                    <h2 className={styles.titulo_permissao}>{nivel.tituloPermissao}</h2>

                    {nivel.itens.map((item, index) => renderItemMestre(item, `${index}`))}

                    {indexPermissao < arrayFiltrada.length - 1 && <hr className={styles.divisor} />}
                </React.Fragment>
            ))}
        </div>
    );
};