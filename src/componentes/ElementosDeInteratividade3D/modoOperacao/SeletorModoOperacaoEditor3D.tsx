'use client';

import styles from './styles.module.css';

import { useEffect, useRef, useState } from 'react';

import { modosOperacaoEditor3D, obtemNomeModoOperacaoEditor3D, type ModoOperacaoEditor3D } from './editor3D.modoOperacao.tipos';
import { useEditor3DContexto } from '../contexto/Editor3DContexto';

function modoOperacaoEstaDisponivel(modo: ModoOperacaoEditor3D, modoAtual: ModoOperacaoEditor3D, podeEntrarEdicao: boolean): boolean {
    if (modo === modoAtual) return false;
    if (modo === 'EDICAO') return podeEntrarEdicao;

    return true;
};

export function SeletorModoOperacaoEditor3D() {
    const raizRef = useRef<HTMLDivElement | null>(null);
    const [aberto, setAberto] = useState(false);
    const { estado, acoes } = useEditor3DContexto();
    const podeEntrarEdicao = estado.modoOperacao === 'OBJETO' && estado.modoAtual.tipo === 'NENHUM' && estado.malhaEmCriacao === null && estado.idsObjetosSelecionados.length > 0;

    useEffect(() => {
        function fechaAoClicarFora(event: MouseEvent): void {
            const raiz = raizRef.current;

            if (raiz === null) return;
            if (!(event.target instanceof Node)) return;
            if (raiz.contains(event.target)) return;

            setAberto(false);
        };

        document.addEventListener('mousedown', fechaAoClicarFora, true);

        return () => document.removeEventListener('mousedown', fechaAoClicarFora, true);
    }, []);

    function selecionaModo(modo: ModoOperacaoEditor3D): void {
        if (!modoOperacaoEstaDisponivel(modo, estado.modoOperacao, podeEntrarEdicao)) return;

        if (modo === 'EDICAO') acoes.entraModoEdicao();
        else acoes.saiModoEdicao();

        setAberto(false);
    };

    return (
        <div ref={raizRef} className={styles.seletorModoOperacaoEditor3D} data-editor3d-modo-operacao="true">
            <button className={styles.botaoModoOperacaoEditor3D} type="button" onClick={() => setAberto(!aberto)} aria-haspopup="menu" aria-expanded={aberto}>
                <span>{obtemNomeModoOperacaoEditor3D(estado.modoOperacao)}</span>
                <strong>Tab</strong>
            </button>

            {aberto && (
                <div className={styles.menuModoOperacaoEditor3D} role="menu">
                    {modosOperacaoEditor3D.map(modo => {
                        const disponivel = modoOperacaoEstaDisponivel(modo.key, estado.modoOperacao, podeEntrarEdicao);

                        return (
                            <button key={modo.key} className={`${styles.itemModoOperacaoEditor3D} ${modo.key === estado.modoOperacao ? styles.itemModoOperacaoEditor3DAtivo : ''}`} type="button" disabled={!disponivel} onClick={() => selecionaModo(modo.key)} role="menuitem">
                                <span>{modo.nome}</span>
                                <small>{modo.descricao}</small>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}