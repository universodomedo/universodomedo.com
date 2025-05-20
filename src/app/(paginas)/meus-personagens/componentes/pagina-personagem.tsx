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
        <div id={styles.recipiente_conteudo_pagina_personagem_selecionado}>
            <ObjetoDeRetorno />
            <h1>{personagemSelecionado?.informacao?.nome}</h1>
            {(personagemSelecionado?.temCriacaoPendente || personagemSelecionado?.temEvolucaoPendente) && (
                <div id={styles.recipiente_botao_evoluir}>
                    <Link href={'/evoluindo-personagem'}>
                        <button>Evoluir</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

function ObjetoDeRetorno() {
    const { deselecionaPersonagem } = useContextoPaginaPersonagem();

    return (
        <div id={styles.recipiente_objeto_voltar} onClick={deselecionaPersonagem}>
            <span>← Voltar</span>
        </div>
    );
};