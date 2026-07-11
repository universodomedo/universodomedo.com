'use client';

import styles from './Editor3D.module.css';

import { useState } from 'react';

const COMANDOS_EDITOR_3D: readonly { readonly categoria: string; readonly itens: readonly { readonly nome: string; readonly atalho: string; }[]; }[] = [
    {
        categoria: 'Modos',
        itens: [
            { nome: 'Selecionar', atalho: 'Q' },
            { nome: 'Mover', atalho: 'G' },
            { nome: 'Rotacionar', atalho: 'R' },
            { nome: 'Escalar', atalho: 'S' },
        ],
    },
    {
        categoria: 'Seleção',
        itens: [
            { nome: 'Selecionar objeto', atalho: 'Clique' },
            { nome: 'Desselecionar', atalho: 'Clique no vazio' },
            { nome: 'Transformar o selecionado', atalho: 'Arrastar gizmo' },
        ],
    },
    {
        categoria: 'Câmera',
        itens: [
            { nome: 'Orbitar', atalho: 'Esquerdo + arrastar' },
            { nome: 'Zoom', atalho: 'Roda do mouse' },
        ],
    },
];

export function BotaoComandoEditor3D() {
    const [aberto, setAberto] = useState(false);

    return (
        <>
            <div className={styles.canto_comando}>
                <button type="button" className={styles.botao_comando} onClick={() => setAberto(true)} aria-label="Abrir comandos" title="Comandos"><span aria-hidden="true">CMD</span></button>
            </div>

            {aberto && (
                <div className={styles.fundo_modal_projeto} onClick={() => setAberto(false)}>
                    <section className={styles.modal_projeto} role="dialog" aria-modal="true" aria-label="Comandos do editor" onClick={evento => evento.stopPropagation()}>
                        <header className={styles.cabecalho_modal_projeto}>
                            <strong>Comandos</strong>
                            <button type="button" onClick={() => setAberto(false)}>Fechar</button>
                        </header>
                        <div className={styles.corpo_modal_projeto}>
                            {COMANDOS_EDITOR_3D.map(grupo => (
                                <section key={grupo.categoria} className={styles.grupo_comandos}>
                                    <h3>{grupo.categoria}</h3>
                                    <ul className={styles.lista_atalhos}>
                                        {grupo.itens.map(item => (
                                            <li key={item.nome}>
                                                <kbd>{item.atalho}</kbd>
                                                <span>{item.nome}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </>
    );
};
