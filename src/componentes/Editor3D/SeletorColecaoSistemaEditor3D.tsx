'use client';

import styles from './Editor3D.module.css';

import { useEffect, useRef, useState } from 'react';

import { ROTULO_COLECAO_SISTEMA_EDITOR3D, colecoesSistemaDoTipoProjeto, type TipoColecaoSistemaEditor3D } from './editor3D.colecoesSistema';
import type { TipoProjetoEditor3D } from 'types-nora-api';

interface SeletorColecaoSistemaEditor3DProps {
    readonly tipoProjeto: TipoProjetoEditor3D;
    readonly colecao: TipoColecaoSistemaEditor3D;
    readonly aoSelecionar: (colecao: TipoColecaoSistemaEditor3D) => void;
};

// O título do painel da árvore É o seletor de Coleção de Sistema: o rótulo mostra onde você está, o clique abre as
// coleções que o TIPO do projeto oferece. Tipo com uma coleção só (Padrão, Capa de Arte, Personagem por ora) não tem o
// que escolher — vira rótulo estático, sem afordância falsa.
export function SeletorColecaoSistemaEditor3D({ tipoProjeto, colecao, aoSelecionar }: SeletorColecaoSistemaEditor3DProps) {
    const [aberto, setAberto] = useState(false);
    const raizRef = useRef<HTMLDivElement | null>(null);
    const colecoes = colecoesSistemaDoTipoProjeto(tipoProjeto);

    useEffect(() => {
        if (!aberto) return;
        function aoClicarFora(evento: MouseEvent): void { if (raizRef.current && !raizRef.current.contains(evento.target as Node)) setAberto(false); };
        function aoTeclar(evento: KeyboardEvent): void { if (evento.key === 'Escape') setAberto(false); };
        document.addEventListener('mousedown', aoClicarFora);
        document.addEventListener('keydown', aoTeclar);
        return () => { document.removeEventListener('mousedown', aoClicarFora); document.removeEventListener('keydown', aoTeclar); };
    }, [aberto]);

    if (colecoes.length === 1) return <span className={styles.rotulo_colecao_sistema}>{ROTULO_COLECAO_SISTEMA_EDITOR3D[colecao]}</span>;

    return (
        <div className={styles.seletor_colecao_sistema} ref={raizRef}>
            <button type="button" className={styles.botao_colecao_sistema} aria-haspopup="listbox" aria-expanded={aberto} onClick={() => setAberto(atual => !atual)}>
                {ROTULO_COLECAO_SISTEMA_EDITOR3D[colecao]}
                <span className={styles.seta_colecao_sistema} aria-hidden="true">⌄</span>
            </button>
            {aberto && (
                <div className={styles.menu_colecao_sistema} role="listbox">
                    {colecoes.map(opcao => (
                        <button key={opcao} type="button" role="option" aria-selected={opcao === colecao} className={styles.item_colecao_sistema} onClick={() => { setAberto(false); aoSelecionar(opcao); }}>
                            {ROTULO_COLECAO_SISTEMA_EDITOR3D[opcao]}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};