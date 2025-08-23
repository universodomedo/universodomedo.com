import styles from './styles.module.css';

import React from 'react';

import { verificarPermissao } from 'Helpers/verificarPermissao';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';

type NivelAcao = {
    labelPermissao: string;
    condicao: boolean;
    acoes: {
        label: string;
        href: string;
    }[];
};

export default function ListaAcoesMestre() {
    const configAcoes: NivelAcao[] = [
        {
            labelPermissao: 'Mestre',
            condicao: true,
            acoes: [
                {
                    label: 'Início',
                    href: ''
                },
            ],
        },
        {
            labelPermissao: 'Fragmento',
            condicao: !!verificarPermissao(usuario => usuario.perfilMestre.id >= 4),
            acoes: [],
        },
        {
            labelPermissao: 'Relíquia',
            condicao: !!verificarPermissao(usuario => usuario.perfilMestre.id >= 3),
            acoes: [
                {
                    label: 'Aventuras',
                    href: 'aventuras'
                },
                {
                    label: 'Personagens',
                    href: 'personagens'
                },
            ],
        },
        {
            labelPermissao: 'Criatura',
            condicao: !!verificarPermissao(usuario => usuario.perfilMestre.id >= 2),
            acoes: [
                {
                    label: 'Sessões Únicas',
                    href: 'sessoes-unicas'
                }
            ]
        },
    ];

    return (
        <div id={styles.recipiente_lista_acoes_pagina_mestre}>
            {configAcoes.filter(nivel => nivel.condicao && nivel.acoes.length > 0).map((nivel, index, arrayFiltrada) => {
                return (
                    <React.Fragment key={index}>
                        <h2 className={styles.titulo_permissao_mestre}>{nivel.labelPermissao}</h2>
                        {nivel.acoes.sort((a, b) => a.label.localeCompare(b.label)).map((acao) => (
                            <div key={acao.href} className={styles.recipiente_linha_acao_mestre}>
                                <CustomLink href={`/mestre/${acao.href}`}><h2>{acao.label}</h2></CustomLink>
                            </div>
                        ))}

                        {index < arrayFiltrada.length - 1 && <hr className={styles.divisor} />}
                    </React.Fragment>
                );
            })}
        </div>
    );
};