'use client';

import styles from '../styles.module.css';

import React from 'react';

import { NivelPermissao, RenderItensPermissoes } from '../componentes';
import { verificarPermissao } from 'Helpers/verificarPermissao';

export default function ListaAcoesPlay() {
    return (
        <div id={styles.recipiente_lista_acoes}>
            {verificarPermissao(usuario => usuario.perfilAdmin.id > 1) && (<SecaoAdmin />)}
            {verificarPermissao(usuario => usuario.perfilMestre.id > 1) && (<SecaoMestre />)}
            <SecaoJogador />
        </div>
    );
};

function SecaoAdmin() {
    const permissoesAdmin: NivelPermissao[] = [
        {
            tituloPermissao: 'Administrador',
            condicao: true,
            itens: [
                {
                    titulo: 'Salas',
                    link: 'gerenciar-salas',
                },
            ],
        },
    ];

    return RenderItensPermissoes(permissoesAdmin, 'admin', false, 'jogo');
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

    return RenderItensPermissoes(permissoesMestre, 'mestre', false, 'jogo');
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
                    link: 'teste',
                },
            ],
        },
    ];

    return RenderItensPermissoes(permissoesJogador, 'jogador', true, 'jogo');
};