'use client';

import styles from './styles.module.css';

import { useContextoSessoesPrevistas } from 'Contextos/ContextoSessoesPrevistas/contexto';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { ContadorRegressivo } from 'Componentes/Elementos/ContadorRegressivo/ContadorRegressivo';
import { formatarDataBR } from 'Uteis/FormatadorDeDatas/FormatadorDeDatas';

import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';

export default function PaginaSessao_InicioSemSessaoEmAndamento() {
    const { episodioSeguinte } = useContextoSessoesPrevistas();

    return (
        <div id={styles.recipiente_pagina_sessao}>
            {!episodioSeguinte ? <PaginaSessao_SemSessaoEmEspera /> : <PaginaSessao_EmPreparo />}
        </div>
    );
};

function PaginaSessao_SemSessaoEmEspera() {
    return (
        <div id={styles.recipiente_sessao_prevista}>
            <h1>Nenhuma Sessão Prevista</h1>
        </div>
    );
};

function PaginaSessao_EmPreparo() {
    const { episodiosFuturos } = useContextoSessoesPrevistas();

    return (
        <div id={styles.recipiente_sessoes_em_preparo}>
            <PaginaSessao_EpisodioSeguinte />
            {episodiosFuturos.length > 0 && <PaginaSessao_EpisodiosFuturos />}
        </div>
    );
};

function PaginaSessao_EpisodioSeguinte() {
    const { episodioSeguinte } = useContextoSessoesPrevistas();

    if (!episodioSeguinte) return <></>;

    return (
        <div id={styles.recipiente_episodio_seguinte}>
            <div id={styles.recipiente_capa_episodio_seguinte}>
                <RecipienteImagem src={episodioSeguinte.grupoAventura.aventura.imagemCapa?.fullPath} />
            </div>
            <div id={styles.recipiente_informacoes_episodio_seguinte}>
                <div id={styles.recipiente_titulo_e_subtitulo_episodio_seguinte}>
                    <h1>{episodioSeguinte.grupoAventura.aventura.titulo}</h1>
                    <h3>{episodioSeguinte.grupoAventura.nome} - Episódio {episodioSeguinte.episodio}</h3>
                </div>
                <h1 id={styles.episodio_seguinte_contagem_regressiva}>Começa em <span id={styles.episodio_seguinte_numeros_contagem_regressiva}><ContadorRegressivo dataAlvo={episodioSeguinte.dataInicioPrevista} /></span></h1>
                <h4 id={styles.episodio_seguinte_descricao_episodio}>Com os recursos de um novo bunker em mãos e entendendo mais sobre o Paranormal, o grupo volta à superficie e rumam novamente em direção ao Furacão na distância</h4>
            </div>
        </div>
    );
};

function PaginaSessao_EpisodiosFuturos() {
    const { episodiosFuturos } = useContextoSessoesPrevistas();

    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <div id={styles.recipiente_episodios_futuros} {...scrollableProps}>
            <div id={styles.recipiente_lista_episodios_futuros}>
                <h1>Sessões Futuras</h1>
                {episodiosFuturos.map(ep => (
                    <div key={ep.id} className={styles.recipiente_item_episodio_futuro}>
                        <div className={styles.recipiente_capa_item_episodio_futuro}>
                            <RecipienteImagem src={ep.grupoAventura.aventura.imagemCapa?.fullPath} />
                        </div>
                        <div className={styles.recipiente_informacaoes_item_episodio_futuro}>
                            <h2>{ep.grupoAventura.aventura.titulo}</h2>
                            <h4>Episódio {ep.episodio}</h4>
                            <h3>{formatarDataBR(ep.dataInicioPrevista)}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};