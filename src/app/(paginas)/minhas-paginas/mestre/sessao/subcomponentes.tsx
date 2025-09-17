

import styles from './styles.module.css';
import React from 'react';
import { EstiloSessao, FormatoMomento } from 'types-nora-api';

import { useContextoPaginaMestreSessao } from 'Contextos/ContextoMestreSessao/contexto';
import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo";
import { formataDuracao } from 'Uteis/FormatadorDeMomento/FormatadorDeMomento';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export function InformacoesGeraisSessao() {
    const { sessaoSelecionada, sessaoDadosGeraisSelecionado } = useContextoPaginaMestreSessao();

    return (
        <>
            <SecaoDeConteudo>
                {sessaoSelecionada.estiloSessao === EstiloSessao.SESSAO_DE_AVENTURA && <h2>{sessaoSelecionada.detalheSessaoAventura.episodioPorExtenso}</h2>}

                {sessaoSelecionada.duracaoEmSegundos && (<h4>Duração: {formataDuracao(sessaoSelecionada.duracaoEmSegundos, FormatoMomento.HMS)}</h4>)}
            </SecaoDeConteudo>

            {sessaoDadosGeraisSelecionado && (
                <SecaoDeConteudo className={styles.recipiente_avatares}>
                    <h2>Mestre</h2>

                    <div className={styles.recipiente_imagem_avatar}>
                        {<RecipienteImagem src={sessaoDadosGeraisSelecionado.mestre.customizacao.caminhoAvatar} />}
                    </div>
                </SecaoDeConteudo>
            )}

            <SecaoDeConteudo className={styles.recipiente_avatares}>
                <h2>Jogadores</h2>

                <div id={styles.recipiente_avatares_jogadores}>
                    {sessaoDadosGeraisSelecionado?.personagens.map(personagem => (
                        <div key={personagem.id} className={styles.recipiente_imagem_avatar}>
                            {<RecipienteImagem src={personagem.caminhoAvatar} />}
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