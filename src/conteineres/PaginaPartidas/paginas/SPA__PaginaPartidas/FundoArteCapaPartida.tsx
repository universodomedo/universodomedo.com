'use client';

import styles from './fundoArteCapa.module.css';

import { useEffect, useRef, useState } from 'react';

import { useImagemCapaArte } from 'Funcionalidades/ArteDeCapa/useImagemCapaArte';

// Fundo da página = Arte de Capa da Partida SELECIONADA (cover, sem título/assinatura), com scrim p/ legibilidade.
// Fluidez: imagem vem do cache compartilhado (instantânea se o orbital já carregou) + crossfade (entra com fade-in, anterior sai com fade-out). A estabilização da seleção (debounce) é ÚNICA e vem do contexto — aqui idProjetoCapa já chega assentado.
export function FundoArteCapaPartida({ idProjetoCapa }: { idProjetoCapa: number | null }) {
    const imagem = useImagemCapaArte(idProjetoCapa);

    const [fundo, setFundo] = useState<{ atual: string | null; anterior: string | null; chave: number }>({ atual: null, anterior: null, chave: 0 });
    const imagemAtualRef = useRef<string | null>(null);

    useEffect(() => {
        if (imagem === imagemAtualRef.current) return;
        const anterior = imagemAtualRef.current;
        imagemAtualRef.current = imagem;
        setFundo(prev => ({ atual: imagem, anterior, chave: prev.chave + 1 }));
    }, [imagem]);

    return (
        <div className={styles.fundo} aria-hidden="true">
            {fundo.anterior && <div key={`saindo-${fundo.chave}`} className={styles.camada_saindo} style={{ backgroundImage: `url("data:image/png;base64,${fundo.anterior}")` }} />}
            {fundo.atual && <div key={`entrando-${fundo.chave}`} className={styles.camada_entrando} style={{ backgroundImage: `url("data:image/png;base64,${fundo.atual}")` }} />}
            <div className={styles.scrim} />
        </div>
    );
};
