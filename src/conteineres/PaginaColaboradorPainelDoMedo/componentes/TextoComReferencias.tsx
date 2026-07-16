'use client';

import styles from './TextoComReferencias.module.css';

// Renderiza texto livre transformando referências de card ("#123" ou "card 123") em chips clicáveis que abrem a ficha do card (resolução global por id, sem depender do objetivo atual).
export default function TextoComReferencias({ texto, aoAbrirCard, tituloCard }: {
    texto: string;
    aoAbrirCard: (cardId: number) => void;
    tituloCard?: (cardId: number) => string;
}) {
    const padrao = /(?:#|\bcard\s+)(\d+)/gi;
    const partes: React.ReactNode[] = [];
    let ultimoIndice = 0;
    let ocorrencia: RegExpExecArray | null;

    while ((ocorrencia = padrao.exec(texto)) !== null) {
        if (ocorrencia.index > ultimoIndice) partes.push(texto.slice(ultimoIndice, ocorrencia.index));
        const cardId = Number(ocorrencia[1]);
        const rotuloTitulo = tituloCard ? tituloCard(cardId) : '';
        partes.push(
            <button key={`${ocorrencia.index}-${cardId}`} className={styles.refCard} title={rotuloTitulo && rotuloTitulo !== '?' ? rotuloTitulo : `Abrir card #${cardId}`} onClick={evento => { evento.stopPropagation(); aoAbrirCard(cardId); }}>
                {ocorrencia[0]}
            </button>,
        );
        ultimoIndice = ocorrencia.index + ocorrencia[0].length;
    }

    if (ultimoIndice < texto.length) partes.push(texto.slice(ultimoIndice));

    return <>{partes}</>;
};
