'use client';

import styles from './styles.module.css';
import React, { useEffect, useRef, useState } from 'react';

import { useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto.tsx';
import JanelaNotificacaoEvolucao from 'Componentes/EdicaoFicha/JanelaNotificacaoEvolucao/page.tsx';

import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import Link from 'next/link';

export default function PaginaEvolucaoPersonagem_ComContexto() {
    const { paginaAberta, ganhos, registraEventoAtualizacaoPagina, executaEAtualiza } = useContextoEdicaoFicha();
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const [_, setState] = useState({});
    useEffect(() => {
        registraEventoAtualizacaoPagina(setState);
    }, [registraEventoAtualizacaoPagina]);

    const janelaNotificacaoRef = useRef<{ openConsole: () => void } | null>(null);
    const handleAbrirJanelaBotaoDesabilitado = () => {
        if (janelaNotificacaoRef.current) {
            janelaNotificacaoRef.current.openConsole();
        }
    };

    const handleMouseEnter = () => {
        const id = setTimeout(() => {
            handleAbrirJanelaBotaoDesabilitado();
        }, 400);
        setTimeoutId(id);
    };

    const handleMouseLeave = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
    };

    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <>
            {!ganhos.estaEmPaginaDeResumo && (<JanelaNotificacaoEvolucao ref={janelaNotificacaoRef} />)}
            <div id={styles.recipiente_pagina_edicao}>
                <div id={styles.recipiente_cabecalho_evolucao}>
                    <h1>{ganhos.cabecalhoEvolucao[0]}</h1>
                    {!ganhos.estaEmPaginaDeResumo && ganhos.etapaAtual.hrefDefinicaoEtapa ? (
                        <Link href={ganhos.etapaAtual.hrefDefinicaoEtapa} target={'_blank'}><h2>{ganhos.cabecalhoEvolucao[1]}</h2></Link>
                    ) : (                        
                        <h2>{ganhos.cabecalhoEvolucao[1]}</h2>
                    )}
                    {ganhos.estaAbertoResumoFinal && (<h4 className={styles.aviso_resumo_final}>Confira com atenção suas escolhas dessa Evolução</h4>)}
                </div>
                <div id={styles.recipiente_conteudo_edicao}>
                    <div id={styles.recipiente_etapa_edicao} {...scrollableProps}>
                        {paginaAberta()}
                    </div>
                    <div id={styles.rodape_edicao}>
                        <button onClick={() => executaEAtualiza(ganhos.retrocedeEtapa)} className={styles.prosseguir}>{ganhos.textoBotaoAnterior}</button>
                        {!ganhos.podeAvancarEtapa ? (
                            <div className={`${styles.recipiente_botao_desabilitado}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                <button disabled={true}>{ganhos.textoBotaoProximo}</button>
                            </div>
                        ) : (
                            <button onClick={() => { executaEAtualiza(ganhos.avancaEtapa) }} disabled={!ganhos.podeAvancarEtapa} className={styles.prosseguir}>{ganhos.textoBotaoProximo}</button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};