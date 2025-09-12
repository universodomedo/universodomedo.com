'use client';

import styles from './styles.module.css';

import { AventuraEstado } from "types-nora-api";

import LayoutContextualizado from 'Componentes/ElementosVisuais/LayoutContextualizado/LayoutContextualizado';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import { useContextoPaginaAventuras } from 'Contextos/ContextoPaginaAventuras/contexto';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import PlayerYouTube from 'Componentes/Elementos/PlayerYouTube/PlayerYouTube';
import { ItemAventuraLista, UltimasSessoesPostadas } from './subcomponentes';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';

export function PaginasAventuras_Contexto() {
    return (
        <LayoutContextualizado>
            <LayoutContextualizado.Conteudo>
                <PaginaAventuras_Conteudo />
            </LayoutContextualizado.Conteudo>
            <LayoutContextualizado.Menu>
                <PaginaAventuras_Menu />
            </LayoutContextualizado.Menu>
        </LayoutContextualizado>
    );
};

function SecaoBarraDeBuscaDeAventuras() {
    return (
        <div id={styles.recipiente_barra_busca}>

        </div>
    );
};

function PaginaAventuras_Conteudo() {
    const { aventuraSelecionada } = useContextoPaginaAventuras();

    return (
        <div id={styles.recipiente_corpo_aventura_selecionada}>
            {!aventuraSelecionada ? <CorpoNovidades /> : <CorpoAventuraSelecionada />}
        </div>
    );
};

function PaginaAventuras_Menu() {
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

    const aventurarEmAndamento = aventurasListadas.filter(aventura => aventura.estadoAtual === AventuraEstado.EM_ANDAMENTO);
    const aventurarFinalizadas = aventurasListadas.filter(aventura => aventura.estadoAtual === AventuraEstado.FINALIZADA);

    return (
        <div id={styles.recipiente_lista_aventuras}>
            {aventurarEmAndamento.sort((a, b) => a.id - b.id).map((aventura, index) => <ItemAventuraLista key={index} aventura={aventura} />)}
            {(aventurarEmAndamento.length > 0 && aventurarFinalizadas.length > 0) && (<hr />)}
            {aventurarFinalizadas.sort((a, b) => new Date(b.dataFimAventura ?? 0).getTime() - new Date(a.dataFimAventura ?? 0).getTime()).map((aventura, index) => <ItemAventuraLista key={index} aventura={aventura} />)}
        </div>
    );
};