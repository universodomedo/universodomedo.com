'use client';

import styles from './styles.module.css';
import Link from 'next/link';

import { useContextoPaginaAventuras } from 'Contextos/ContextoPaginaAventuras/contexto';
import { AventuraEstado } from "types-nora-api";

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import PlayerYouTube from 'Componentes/ElementosVisuais/PlayerYouTube/PlayerYouTube';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';

export function PaginaAventuras_Slot() {
    const { aventuraSelecionada } = useContextoPaginaAventuras();

    const { scrollableProps: scrollablePropsInteragindo } = useScrollable({ modo: 'visivelQuandoInteragindo' });

    return (
        <div id={styles.recipiente_pagina_aventuras}>
            <SecaoBarraDeBuscaDeAventuras />
            <div id={styles.recipiente_corpo_aventuras}>
                <div id={styles.recipiente_aventura_selecionada}>
                    {!aventuraSelecionada ? <CorpoNovidades /> : <CorpoAventuraSelecionada />}
                </div>
                <div id={styles.recipiente_menu_aventuras} {...scrollablePropsInteragindo}>
                    <MenuLateralAventurasListadas />
                </div>
            </div>
        </div>
    );
};

function SecaoBarraDeBuscaDeAventuras() {
    return (
        <div id={styles.recipiente_barra_busca}>

        </div>
    );
};

function CorpoNovidades() {
    return (
        <div id={styles.recipiente_corpo_aventura_selecionada}>
            <div id={styles.recipiente_capa_aventura_selecionada}>
                <RecipienteImagem src={''} />
            </div>
            <div>
                <h1>Apenas uma Prece</h1>
            </div>
        </div>
    );
};

function CorpoAventuraSelecionada() {
    const { aventuraSelecionada } = useContextoPaginaAventuras();
    const aventura = aventuraSelecionada!;

    const { scrollableProps: scrollablePropsSempreVisivel } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <div id={styles.recipiente_corpo_aventura_selecionada} {...scrollablePropsSempreVisivel}>
            <div id={styles.recipiente_cabecalho_aventura_selecionada}>
                <h1>{aventura.titulo}</h1>
                <div id={styles.recipiente_capa_aventura_selecionada}>
                    {aventura.gruposAventura && aventura.gruposAventura.length > 0 && aventura.gruposAventura[0].linkTrailerYoutube
                        ? <PlayerYouTube urlSufixo={aventura.gruposAventura[0].linkTrailerYoutube.sufixo} />
                        : <RecipienteImagem src={aventura.imagemCapa?.fullPath} />
                    }
                </div>
            </div>
            <div id={styles.recipiente_grupos_aventura_selecionada}>
                {aventura.gruposAventura?.sort((a, b) => a.id - b.id).map(grupo => (
                    <div key={grupo.id} className={styles.recipiente_linha_grupo}>
                        <div className={styles.linha_grupo_esquerda}>
                            <div id={styles.recipiente_personagens_participantes}>
                                {grupo.personagensDaAventura?.map((personagensDaAventura, index) => (
                                    <div key={index} className={styles.recipiente_imagem_personagem_participante}>
                                        <RecipienteImagem key={personagensDaAventura.personagem.id} src={personagensDaAventura.personagem.imagemAvatar?.fullPath} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.linha_grupo_direita}>
                            <h1><Link href={`/aventura/${grupo.id}`}>Assistir</Link></h1>
                            {aventura.temApenasUmGrupo && (<h2>{grupo.nome}</h2>)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

function MenuLateralAventurasListadas() {
    const { buscaAventuraSelecionada, aventurasListadas } = useContextoPaginaAventuras();

    return (
        <>
            {(aventurasListadas ?? []).filter(aventura => aventura.estadoAtual === AventuraEstado.EM_ANDAMENTO).sort((a, b) => new Date(a.dataCriacao).getTime() - new Date(b.dataCriacao).getTime()).map((aventura, index) => (
                <div key={index} className={styles.recipiente_item_menu_aventuras} onClick={() => { buscaAventuraSelecionada(aventura.id) }}>
                    <div className={styles.recipiente_imagem_aventura_item_menu}>
                        <RecipienteImagem src={aventura.imagemCapa?.fullPath} />
                    </div>
                    <div className={styles.recipiente_dados_aventura}>
                        <h3>{aventura.titulo}</h3>
                        <h3>{aventura.estadoAtual}</h3>
                    </div>
                </div>
            ))}
            <hr />
            {(aventurasListadas ?? []).filter(aventura => aventura.estadoAtual === AventuraEstado.FINALIZADA).sort((a, b) => new Date(b.dataFimAventura ?? 0).getTime() - new Date(a.dataFimAventura ?? 0).getTime()).map((aventura, index) => (
                <div key={index} className={styles.recipiente_item_menu_aventuras} onClick={() => { buscaAventuraSelecionada(aventura.id) }}>
                    <div className={styles.recipiente_imagem_aventura_item_menu}>
                        <RecipienteImagem src={aventura.imagemCapa?.fullPath} />
                    </div>
                    <div className={styles.recipiente_dados_aventura}>
                        <h3>{aventura.titulo}</h3>
                        <h3>{aventura.estadoAtual}</h3>
                    </div>
                </div>
            ))}
        </>
    );
};