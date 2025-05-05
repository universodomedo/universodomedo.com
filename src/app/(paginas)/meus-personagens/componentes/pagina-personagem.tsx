'use client';

import styles from '../styles.module.css';

import { useContextoPaginaPersonagem } from '../contexto.tsx';

import Link from 'next/link';

export function PaginaPersonagemSelecionado() {
    const { personagemSelecionado } = useContextoPaginaPersonagem();

    if (!personagemSelecionado) return <div>Erro ao carregar personagem</div>;

    return <PaginaPersonagemComDados />
};

function PaginaPersonagemComDados() {
    const { personagemSelecionado } = useContextoPaginaPersonagem();

    return (
        <>
            <h1>{personagemSelecionado?.informacao?.nome}</h1>
            {personagemSelecionado?.fichaPendente && (
                <div id={styles.recipiente_botao_evoluir}>
                    <Link href={'/evoluindo-personagem'}>
                        <button>Evoluir</button>
                    </Link>
                </div>
            )}
        </>
    );
}