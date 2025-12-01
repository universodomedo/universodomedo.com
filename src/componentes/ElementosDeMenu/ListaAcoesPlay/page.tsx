'use client';

import styles from '../styles.module.css';

import React from 'react';

import { NivelPermissao, RenderItensPermissoes } from '../componentes';
import { verificarPermissao } from 'Helpers/verificarPermissao';

export default function ListaAcoesPlay() {
    return (
        <div id={styles.recipiente_lista_acoes}>
            {verificarPermissao(usuario => usuario.perfilMestre.id > 1) && (<SecaoMestre />)}
            <SecaoJogador />
        </div>
    );
};

function SecaoMestre() {
    const permissoesMestre: NivelPermissao[] = [
        {
            tituloPermissao: 'Mestre',
            condicao: true,
            itens: [
                {
                    titulo: 'Sessões',
                    link: 'sessoes-mestre',
                },
            ],
        },
    ];

    return RenderItensPermissoes(permissoesMestre, 'play', false);
};

function SecaoJogador() {
    const permissoesJogador: NivelPermissao[] = [
        {
            tituloPermissao: 'Jogador',
            condicao: true,
            itens: [
                {
                    titulo: 'Minhas Sessões',
                    link: 'sessoes-jogador',
                },
                {
                    titulo: 'Modo Individual',
                    link: 'individial',
                },
                {
                    titulo: 'Teste',
                    link: 'jogador',
                },
            ],
        },
    ];

    return RenderItensPermissoes(permissoesJogador, 'play', true);
};