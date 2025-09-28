'use client';

import styles from 'Componentes/PaginaPersonagem/styles.module.css';

import { useContextoPaginaPersonagens } from 'Contextos/ContextoPaginaPersonagens/contexto';
import BarraPersonagem from 'Componentes/PaginaPersonagem/componentes/BarraPersonagem/BarraPersonagem'
import BotaoEvoluir from 'Componentes/PaginaPersonagem/componentes/BotaoEvoluir/BotaoEvoluir';

export default function PaginaEditavel_Inicial() {
    const { personagemSelecionado } = useContextoPaginaPersonagens();

    return (
        <div id={styles.recipiente_conteudo_pagina_personagem_selecionado}>
            <BarraPersonagem />
            <BotaoEvoluir />
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