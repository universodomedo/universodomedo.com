'use client';

import styles from './styles.module.css';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';

import { useContextoPaginaAventuras } from 'Contextos/ContextoPaginaAventuras/contexto';
import { AventuraEstado } from "types-nora-api";

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import PlayerYouTube from 'Componentes/Elementos/PlayerYouTube/PlayerYouTube';
import { ItemAventuraLista, UltimasSessoesPostadas } from './subcomponentes';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
// import { useAtualizaConteudoGeral, useAtualizaConteudoMenu } from 'Contextos/ContextoLayoutVisualizacaoPadrao/hooks';
import { ContextoLayoutVisualizacaoPadraoProvider } from 'Contextos/ContextoLayoutVisualizacaoPadrao/contexto';
import { useMemo } from 'react';
import LayoutContextualizado from 'Contextos/ContextoLayoutVisualizacaoPadrao/page';

export function PaginaAventuras_Slot() {
    return (
        <>
            {/* <SecaoBarraDeBuscaDeAventuras /> */}
            <ContextoLayoutVisualizacaoPadraoProvider>
                <PaginaAventuras_LayoutVisualizacao />
            </ContextoLayoutVisualizacaoPadraoProvider>
        </>
    )
};

export function PaginaAventuras_LayoutVisualizacao() {
    // useAtualizaConteudoGeral(useMemo(() => <ConteudoGeral />, []));
    // useAtualizaConteudoMenu(useMemo(() => <ConteudoMenu />, []));

    return <LayoutContextualizado />;
};

function SecaoBarraDeBuscaDeAventuras() {
    return (
        <div id={styles.recipiente_barra_busca}>

        </div>
    );
};

function ConteudoGeral() {
    const { aventuraSelecionada } = useContextoPaginaAventuras();

    return (
        <div id={styles.recipiente_corpo_aventura_selecionada}>
            {!aventuraSelecionada ? <CorpoNovidades /> : <CorpoAventuraSelecionada />}
        </div>
    );
};

function ConteudoMenu() {
    return (
        <MenuLateralAventurasListadas />
    );
};

function CorpoNovidades() {
    return (
        <>
            <UltimasSessoesPostadas />
        </>
    );
};

function CorpoAventuraSelecionada() {
    const { aventuraSelecionada } = useContextoPaginaAventuras();

    if (!aventuraSelecionada) return <div>Aventura não encontrada</div>

    return (
        <SecaoDeConteudo id={styles.recipiente_conteudo_selecionado}>
            <div id={styles.recipiente_cabecalho_aventura_selecionada}>
                <h1>{aventuraSelecionada.titulo}</h1>
                <div id={styles.recipiente_capa_aventura_selecionada}>
                    {aventuraSelecionada.gruposAventura && aventuraSelecionada.gruposAventura.length > 0 && aventuraSelecionada.gruposAventura[0].linkTrailerYoutube
                        ? <PlayerYouTube urlSufixo={aventuraSelecionada.gruposAventura[0].linkTrailerYoutube.sufixo} />
                        : <RecipienteImagem src={aventuraSelecionada.imagemCapa?.fullPath} />
                    }
                </div>
            </div>
            <div id={styles.recipiente_grupos_aventura_selecionada}>
                {aventuraSelecionada.gruposAventura?.sort((a, b) => a.id - b.id).map(grupo => (
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
                            <h1><CustomLink href={`/aventura/${grupo.id}`}>Assistir</CustomLink></h1>
                            {!aventuraSelecionada.temApenasUmGrupo && (<h2>{grupo.nome}</h2>)}
                        </div>
                    </div>
                ))}
            </div>
        </SecaoDeConteudo>
    );
};

function MenuLateralAventurasListadas() {
    const { aventurasListadas } = useContextoPaginaAventuras();

    if (!aventurasListadas) return <p>Não foram encontradas Aventuras</p>;

    return (
        <>
            {aventurasListadas.filter(aventura => aventura.estadoAtual === AventuraEstado.EM_ANDAMENTO).sort((a, b) => (new Date(a.gruposAventura!.find(g => g.dataQueIniciou)?.dataQueIniciou || '9999-12-31').getTime() - new Date(b.gruposAventura!.find(g => g.dataQueIniciou)?.dataQueIniciou || '9999-12-31').getTime())).map((aventura, index) => <ItemAventuraLista key={index} aventura={aventura} />)}
            <hr />
            {aventurasListadas.filter(aventura => aventura.estadoAtual === AventuraEstado.FINALIZADA).sort((a, b) => new Date(b.dataFimAventura ?? 0).getTime() - new Date(a.dataFimAventura ?? 0).getTime()).map((aventura, index) => <ItemAventuraLista key={index} aventura={aventura} />)}
        </>
    );
};