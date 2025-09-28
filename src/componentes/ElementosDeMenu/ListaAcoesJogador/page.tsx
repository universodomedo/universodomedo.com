import styles from '../styles.module.css';

import React, { JSX } from 'react';

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
    const permissoesJogador: NivelPermissaoMestre[] = [
        {
            tituloPermissao: 'Jogador',
            condicao: true,
            itens: [
                {
                    titulo: 'Início',
                    link: ''
                },
                {
                    titulo: 'Meus Personagens',
                    link: 'meus-personagens'
                },
            ],
        },
    ];

    const renderItemJogador = (item: ItemMenuMestre, key: string): JSX.Element => {
        const temSubitens = item.subitens && item.subitens.length > 0;

        return (
            <div key={key} className={styles.recipiente_item_lista_acoes}>
                {item.link === undefined ? (
                    <h2>{item.titulo}</h2>
                ) : (
                    <CustomLink href={`/minhas-paginas/jogador/${item.link}`}>
                        <h2>{item.titulo}</h2>
                    </CustomLink>
                )}

                {temSubitens && (
                    <div className={styles.recipiente_subitens_lista_acoes}>
                        {item.subitens!.map((sub, idx) => renderItemJogador(sub, `${key}-${idx}`))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div id={styles.recipiente_lista_acoes}>
            {permissoesJogador.filter(nivel => nivel.condicao && nivel.itens.length > 0).map((nivel, indexPermissao, arrayFiltrada) => (
                <React.Fragment key={indexPermissao}>
                    <h2 className={styles.titulo_permissao}>{nivel.tituloPermissao}</h2>

                    {nivel.itens.map((item, index) => renderItemJogador(item, `${index}`))}

                    {indexPermissao < arrayFiltrada.length - 1 && <hr className={styles.divisor} />}
                </React.Fragment>
            ))}
        </div>
    );
};