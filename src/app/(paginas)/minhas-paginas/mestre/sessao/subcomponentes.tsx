

import styles from './styles.module.css';

import { useContextoPaginaMestreSessao } from 'Contextos/ContextoMestreSessao/contexto';
import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo";
import { formataDuracao } from 'Uteis/FormatadorDeMomento/FormatadorDeMomento';
import { FormatoMomento } from 'types-nora-api';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import React from 'react';

export function InformacoesGeraisSessao() {
    const { sessaoSelecionada, mestre } = useContextoPaginaMestreSessao();

    return (
        <>
            <SecaoDeConteudo>
                <h2>{sessaoSelecionada.detalheSessaoCanonica.episodioPorExtenso}</h2>

                {sessaoSelecionada.duracaoEmSegundos && (<h4>Duração: {formataDuracao(sessaoSelecionada.duracaoEmSegundos, FormatoMomento.HMS)}</h4>)}
            </SecaoDeConteudo>

            {mestre && (
                <SecaoDeConteudo className={styles.recipiente_avatares}>
                    <h2>Mestre</h2>

                    <div className={styles.recipiente_imagem_avatar}>
                        {<RecipienteImagem src={mestre.customizacao.caminhoAvatar} />}
                    </div>
                </SecaoDeConteudo>
            )}

            <SecaoDeConteudo className={styles.recipiente_avatares}>
                <h2>Jogadores</h2>

                <div id={styles.recipiente_avatares_jogadores}>
                    {sessaoSelecionada.detalheSessaoCanonica.grupoAventura?.personagensDaAventura?.map(personagemAventura => (
                        <div key={personagemAventura.fkPersonagensId} className={styles.recipiente_imagem_avatar}>
                            {<RecipienteImagem src={personagemAventura.personagem.caminhoAvatar} />}
                        </div>
                    ))}
                </div>
            </SecaoDeConteudo>
        </>
    );
};

export function ListaInfracoesSessao() {
    const { sessaoSelecionada } = useContextoPaginaMestreSessao();

    return (
        <SecaoDeConteudo>
            <></>
        </SecaoDeConteudo>
    );
};