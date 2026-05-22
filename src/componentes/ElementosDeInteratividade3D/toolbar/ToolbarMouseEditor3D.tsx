'use client';

import styles from './styles.module.css';

import { useEffect, useState } from 'react';

import { useEditor3DContexto } from '../contexto/Editor3DContexto';
import type { FerramentaMouseEditor3D } from '../mouse/editor3D.mouse.tipos';
import type { TipoModoEditor3D } from '../modos/editor3D.modo.tipos';

type ModoInteracaoToolbarEditor3D = 'SELECIONAR' | 'MOVER' | 'ROTACIONAR' | 'ESCALAR' | 'ROTACIONAR_RAPIDO' | 'ORBITAR_CAMERA' | 'PAN_CAMERA';

interface ModoInteracaoToolbarEditor3DDef {
    readonly key: ModoInteracaoToolbarEditor3D;
    readonly nome: string;
    readonly icone: string;
    readonly atalho: string;
    readonly descricao: string;
};

const modosInteracaoToolbarEditor3D: ModoInteracaoToolbarEditor3DDef[] = [
    { key: 'SELECIONAR', nome: 'Selecionar', icone: '↖', atalho: 'LMB', descricao: 'Seleciona objetos ou faces conforme o modo de operação atual.' },
    { key: 'MOVER', nome: 'Mover', icone: '✥', atalho: 'G', descricao: 'Move o objeto selecionado no Object Mode.' },
    { key: 'ROTACIONAR', nome: 'Rotacionar', icone: '⟳', atalho: 'R', descricao: 'Rotaciona o objeto selecionado no Object Mode.' },
    { key: 'ESCALAR', nome: 'Escalar', icone: '⤢', atalho: 'S', descricao: 'Escala o objeto selecionado no Object Mode.' },
    { key: 'ROTACIONAR_RAPIDO', nome: 'Rotacionar Rápido', icone: '↻', atalho: 'Alt + MMB', descricao: 'Aplica Snap Orbital Relativo de 90° a partir da orientação atual da câmera.' },
    { key: 'ORBITAR_CAMERA', nome: 'Orbitar Câmera', icone: '◉', atalho: 'MMB', descricao: 'Rotaciona livremente a câmera.' },
    { key: 'PAN_CAMERA', nome: 'Pan Câmera', icone: '↔', atalho: 'Shift + MMB', descricao: 'Move a câmera lateralmente sem alterar a orientação.' },
];

function obtemModoInteracaoAtualEditor3D(tipoModo: TipoModoEditor3D, ferramentaMouse: FerramentaMouseEditor3D): ModoInteracaoToolbarEditor3D {
    if (tipoModo === 'GRAB') return 'MOVER';
    if (tipoModo === 'ROTATE') return 'ROTACIONAR';
    if (tipoModo === 'SCALE') return 'ESCALAR';
    if (ferramentaMouse === 'ROTACIONAR_RAPIDO') return 'ROTACIONAR_RAPIDO';
    if (ferramentaMouse === 'ROTACIONAR') return 'ORBITAR_CAMERA';
    if (ferramentaMouse === 'PAN') return 'PAN_CAMERA';

    return 'SELECIONAR';
};

function obtemDefinicaoModoInteracaoEditor3D(modo: ModoInteracaoToolbarEditor3D): ModoInteracaoToolbarEditor3DDef { return modosInteracaoToolbarEditor3D.find(definicao => definicao.key === modo) ?? modosInteracaoToolbarEditor3D[0]; };

export function ToolbarMouseEditor3D() {
    const { estado } = useEditor3DContexto();
    const [atalhosAbertos, setAtalhosAbertos] = useState(false);
    const modoAtual = obtemDefinicaoModoInteracaoEditor3D(obtemModoInteracaoAtualEditor3D(estado.modoAtual.tipo, estado.ferramentaMouse));

    useEffect(() => {
        if (!atalhosAbertos) return;

        function bloqueiaAtalhosComModalAberta(event: KeyboardEvent): void {
            event.stopImmediatePropagation();
            if (event.key === 'Escape') setAtalhosAbertos(false);
            event.preventDefault();
        };

        window.addEventListener('keydown', bloqueiaAtalhosComModalAberta, true);

        return () => window.removeEventListener('keydown', bloqueiaAtalhosComModalAberta, true);
    }, [atalhosAbertos]);

    return (
        <aside className={styles.toolbarMouseEditor3D} data-editor3d-toolbar-mouse="true" aria-label="Modo atual de interação">
            <div className={styles.visualizadorModoAtualEditor3D} title={`${modoAtual.nome} (${modoAtual.atalho})`} aria-live="polite">
                <span className={styles.iconeModoAtualEditor3D}>{modoAtual.icone}</span>
                <strong>{modoAtual.nome}</strong>
            </div>

            <button className={styles.botaoAjudaModosEditor3D} type="button" onClick={() => setAtalhosAbertos(true)} aria-label="Abrir lista de modos e atalhos" title="Modos e atalhos">?</button>

            {atalhosAbertos && (
                <div className={styles.fundoModalModosEditor3D} data-editor3d-modal-atalhos="true" role="presentation" onMouseDown={event => event.stopPropagation()}>
                    <section className={styles.janelaModosEditor3D} role="dialog" aria-modal="true" aria-label="Modos e atalhos do editor 3D">
                        <header className={styles.cabecalhoJanelaModosEditor3D}>
                            <div>
                                <span>Modos do Editor</span>
                                <strong>Legenda e atalhos</strong>
                            </div>

                            <button type="button" onClick={() => setAtalhosAbertos(false)} aria-label="Fechar lista de modos">Fechar</button>
                        </header>

                        <div className={styles.listaModosEditor3D}>
                            {modosInteracaoToolbarEditor3D.map(modo => (
                                <div key={modo.key} className={styles.itemListaModosEditor3D}>
                                    <span className={styles.iconeListaModosEditor3D}>{modo.icone}</span>

                                    <div className={styles.textoListaModosEditor3D}>
                                        <strong>{modo.nome}</strong>
                                        <span>{modo.descricao}</span>
                                    </div>

                                    <kbd>{modo.atalho}</kbd>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </aside>
    );
};