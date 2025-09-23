'use client';

import styles from '../styles.module.css';
import Link from 'next/link';

import { useContextoListagemPersonagens } from 'Contextos/ContextoListagemPersonagens/contexto';


export function PaginaPersonagemSelecionado() {
    const { personagemSelecionado } = useContextoListagemPersonagens();

    if (!personagemSelecionado) return <div>Erro ao carregar personagem</div>;

    return <PaginaPersonagemComDados />
};

function PaginaPersonagemComDados() {
    const { personagemSelecionado } = useContextoListagemPersonagens();

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
            {personagemSelecionado?.fichaVigente && (
                <div id={styles.recipiente_abas_fichas}>
                    <h3>Ficha Atual</h3>
                    <div id={styles.recipiente_provisorio_atributos}>
                        {personagemSelecionado?.fichaVigente.fichaDeJogo.atributos.map(atributoFicha => (
                            <p key={atributoFicha.atributo.id}>{atributoFicha.atributo.nomeAbreviado}: {atributoFicha.valor}</p>
                        ))}
                    </div>
                    <div id={styles.recipiente_provisorio_atributos}>
                        {personagemSelecionado?.fichaVigente.fichaDeJogo.pericias.sort((a, b) => a.pericia.nome.localeCompare(b.pericia.nome)).map(periciaFicha => (
                            <p key={periciaFicha.pericia.id}>{periciaFicha.pericia.nomeAbreviado}: <strong style={{color: periciaFicha.patentePericia.cor}}>{periciaFicha.patentePericia.nome}</strong></p>
                        ))}
                    </div>
                    <div id={styles.recipiente_provisorio_atributos}>
                        {personagemSelecionado?.fichaVigente.fichaDeJogo.estatisticasDanificaveis.map(estatisticasDanificaveisFicha => (
                            <p key={estatisticasDanificaveisFicha.estatisticaDanificavel.id}>{estatisticasDanificaveisFicha.estatisticaDanificavel.nomeAbreviado}: {estatisticasDanificaveisFicha.valorMaximo}</p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

function ObjetoDeRetorno() {
    const { deselecionaPersonagem } = useContextoListagemPersonagens();

    return (
        <div id={styles.recipiente_objeto_voltar} onClick={deselecionaPersonagem}>
            <span>← Voltar</span>
        </div>
    );
};