'use client';

import styles from './styles.module.css';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { useContextoEvoluindoPersonagem } from 'Contextos/ContextoEvoluindoPersonagem/contexto.tsx';
import { EstadoPendenciaPersonagem } from 'types-nora-api';
import PaginaEvolucaoPersonagem from 'Componentes/EdicaoFicha/page.tsx';
import Link from 'next/link';

export function PaginaEvoluindoPersonagem_Slot() {
    const { personagemEvoluindo } = useContextoEvoluindoPersonagem();

    return !personagemEvoluindo ? <PaginaListaPersonagensParaEvoluir /> : <PaginaEvolucaoPersonagem />
};

function PaginaListaPersonagensParaEvoluir() {
    return (
        <div id={styles.recipiente_pagina_evolucao}>
            <h1>Evoluções Pendentes</h1>

            <PaginaListaPersonagensParaEvoluirComDados />

            <Link href={'/meus-personagens'}>Voltar para Meus Personagens</Link>
        </div>
    );
};

function PaginaListaPersonagensParaEvoluirComDados() {
    const { listaPersonagensEvolucaoPendente, selecionaPersonagemEvoluindo } = useContextoEvoluindoPersonagem();

    if (!listaPersonagensEvolucaoPendente || listaPersonagensEvolucaoPendente.length < 1)
        return (
            <h2>Não há nenhum Personagem pendente de Evolução</h2>
        );

    return (
        <div id={styles.recipiente_lista_personagens_para_evoluir}>
            {listaPersonagensEvolucaoPendente!.map(personagem => (
                <div key={personagem.id} className={styles.recipiente_personagem_para_evoluir}>
                    <div className={styles.recipiente_avatar_personagem_para_evoluir}>
                        <RecipienteImagem src={personagem.imagemAvatar?.fullPath} />
                    </div>
                    <div className={styles.recipiente_informacoes_personagem_para_evoluir}>
                        <div className={styles.recipiente_dados_personagem_para_evoluir}>
                            <h1>{personagem.informacao.nome}</h1>
                            {personagem.pendencias.pendeciaUsuario !== EstadoPendenciaPersonagem.FICHA_NAO_CRIADA && (
                                <h2>{personagem.fichaVigente?.fichaDeJogo.classe.nome} {personagem.fichaVigente?.nivel.nomeVisualizacao}</h2>
                            )}
                        </div>
                        <button onClick={() => selecionaPersonagemEvoluindo(personagem.id)}>{personagem.pendencias.pendeciaUsuario === EstadoPendenciaPersonagem.FICHA_NAO_CRIADA ? `Criar Ficha` : `Evoluir`}</button>
                    </div>
                </div>
            ))}
        </div>
    );
};