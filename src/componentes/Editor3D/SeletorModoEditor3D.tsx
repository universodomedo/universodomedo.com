'use client';

import styles from './Editor3D.module.css';

import { useEffect, useRef, useState } from 'react';

import { ROTULO_MODO_TRANSFORM_EDITOR3D, type ModoTransformEditor3D } from './editor3D.tipos';

export type ModoOperacaoEditor3D = 'OBJETO' | 'EDICAO';

const MODOS_OPERACAO_EDITOR3D: readonly { readonly modo: ModoOperacaoEditor3D; readonly rotulo: string; readonly descricao: string; }[] = [
    { modo: 'OBJETO', rotulo: 'Objeto', descricao: 'Seleciona e transforma objetos inteiros.' },
    { modo: 'EDICAO', rotulo: 'Edição', descricao: 'Edita a geometria interna da malha selecionada.' },
];

const ROTULO_OPERACAO_EDITOR3D: Record<ModoOperacaoEditor3D, string> = { OBJETO: 'Objeto', EDICAO: 'Edição' };

interface SeletorModoEditor3DProps {
    readonly modoOperacao: ModoOperacaoEditor3D;
    readonly modoTransform: ModoTransformEditor3D;
    readonly podeEditar: boolean;
    readonly aoTrocarModoOperacao: (modo: ModoOperacaoEditor3D) => void;
};

export function SeletorModoEditor3D({ modoOperacao, modoTransform, podeEditar, aoTrocarModoOperacao }: SeletorModoEditor3DProps) {
    const raizRef = useRef<HTMLDivElement | null>(null);
    const [aberto, setAberto] = useState(false);

    useEffect(() => {
        function fechaAoClicarFora(evento: MouseEvent): void {
            const raiz = raizRef.current;
            if (raiz === null || !(evento.target instanceof Node) || raiz.contains(evento.target)) return;
            setAberto(false);
        };
        document.addEventListener('mousedown', fechaAoClicarFora, true);
        return () => document.removeEventListener('mousedown', fechaAoClicarFora, true);
    }, []);

    function seleciona(modo: ModoOperacaoEditor3D): void {
        if (modo === 'EDICAO' && !podeEditar) return;
        aoTrocarModoOperacao(modo);
        setAberto(false);
    };

    return (
        <div ref={raizRef} className={styles.seletor_modo}>
            <button type="button" className={styles.botao_modo_op} aria-haspopup="menu" aria-expanded={aberto} onClick={() => setAberto(valor => !valor)}>
                <span>{ROTULO_OPERACAO_EDITOR3D[modoOperacao]}</span>
                <strong>{ROTULO_MODO_TRANSFORM_EDITOR3D[modoTransform]} · Tab</strong>
            </button>

            {aberto && (
                <div className={styles.menu_modo} role="menu">
                    {MODOS_OPERACAO_EDITOR3D.map(item => {
                        const desabilitado = item.modo === 'EDICAO' && !podeEditar;

                        return (
                            <button key={item.modo} type="button" className={`${styles.item_modo} ${item.modo === modoOperacao ? styles.item_modo_ativo : ''}`} role="menuitem" disabled={desabilitado} onClick={() => seleciona(item.modo)}>
                                <span>{item.rotulo}{item.modo === 'EDICAO' && <kbd>Tab</kbd>}</span>
                                <small>{desabilitado ? 'Selecione um objeto para editar.' : item.descricao}</small>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
