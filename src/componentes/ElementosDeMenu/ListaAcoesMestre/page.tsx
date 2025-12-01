import styles from '../styles.module.css';

import React from 'react';

import { NivelPermissao, RenderItemBase, RenderItensPermissoes } from '../componentes';
import { verificarPermissao } from 'Helpers/verificarPermissao';

export default function ListaAcoesMestre() {
    const permissoesMestre: NivelPermissao[] = [
        {
            tituloPermissao: 'Mestre',
            condicao: true,
            itens: [
                { titulo: 'Início', link: '' },
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
                        { titulo: 'Minhas Aventuras', link: 'aventuras' },
                        { titulo: 'Rascunhos', link: 'rascunhos/aventuras' },
                    ],
                },
                { titulo: 'Personagens', link: 'personagens' },
            ],
        },
        {
            tituloPermissao: 'Criatura',
            condicao: !!verificarPermissao(usuario => usuario.perfilMestre.id >= 2),
            itens: [
                {
                    titulo: 'Sessões Únicas',
                    subitens: [
                        { titulo: 'Minhas Sessões Únicas', link: 'sessoes-unicas' },
                        { titulo: 'Rascunhos', link: 'rascunhos/sessoes-unicas' },
                    ],
                },
            ]
        },
    ];

    return RenderItensPermissoes(permissoesMestre, 'mestre', false);
};