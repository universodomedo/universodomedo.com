'use client';

import styles from './styles.module.css';
import { useEffect, useRef, useState } from 'react';

import { useContextoEdicaoFicha } from 'Contextos/ContextoEdicaoFicha/contexto.tsx';
import { useContextoEvoluindoPersonagem } from 'Contextos/ContextoEvoluindoPersonagem/contexto';
import JanelaNotificacaoEvolucao from 'Componentes/EdicaoFicha/JanelaNotificacaoEvolucao/page.tsx';

export default function PaginaEvolucaoPersonagem_ComContexto() {
    const { deselecionaPersonagemEvoluindo } = useContextoEvoluindoPersonagem();
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

    return (
        <>
            {!ganhos.estaEmPaginaDeResumo && (<JanelaNotificacaoEvolucao ref={janelaNotificacaoRef} />)}
            <div id={styles.recipiente_pagina_edicao}>
                <h1>{ganhos.tituloNexUp}</h1>
                <div id={styles.recipiente_conteudo_edicao}>
                    <div id={styles.recipiente_etapa_edicao}>
                        {paginaAberta()}
                    </div>
                    <div id={styles.rodape_edicao}>
                        <button onClick={() => executaEAtualiza(ganhos.retrocedeEtapa)} disabled={!ganhos.podeRetrocederEtapa} className={styles.prosseguir}>{ganhos.textoBotaoAnterior}</button>
                        {!ganhos.podeAvancarEtapa ? (
                            <div className={`${styles.recipiente_botao_desabilitado}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                <button onClick={() => { ganhos.estaAbertoResumoInicial ? deselecionaPersonagemEvoluindo() : executaEAtualiza(ganhos.avancaEtapa)} } disabled={!ganhos.podeAvancarEtapa}>{ganhos.textoBotaoProximo}</button>
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