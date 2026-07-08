'use client';

import styles from './styles.module.css';

import type { ArteCapaDaPartida, ConfiguracaoPartida } from 'types-nora-api';

import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import { ItemPartidaOrbital } from 'Componentes/ElementosDeJogo/ItemPartidaOrbital/ItemPartidaOrbital';
import { useImagemCapaArte } from 'Funcionalidades/ArteDeCapa/useImagemCapaArte';
import { PreviewMusicaConfigurada } from './PreviewMusicaConfigurada';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao/contexto';

// Dados de Exibição da Partida: visão só-leitura (nada editável direto). Cada card tem um "Editar" que entra no editor daquele dado.
// Rodapé: Desabilitar/Reabilitar a Partida (aposentadoria soft — some das superfícies de jogo, reversível), no lugar de um "deletar".
export default function SPA__PaginaGameDesignerConfiguracaoPartida__Visao() {
    const { partida, configuracaoInicial, carregando, erro, setAba, idMusicaConfigurada, idMusicaEmJogo, salvando, alternarDesabilitada } = useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao();

    return (
        <ConteudoForm>
            <ConteudoForm.AreaCorpo>
                <div className={styles.host}>
                    <div className={styles.grade}>
                        <CardArteCapa nome={partida.nome} arteCapa={partida.arteCapa} aoEditar={() => setAba('arteCapa')} />
                        <CardMusica idMusica={idMusicaConfigurada} aoEditar={() => setAba('musica')} />
                        <CardMusicaEmJogo idMusica={idMusicaEmJogo} aoEditar={() => setAba('musicaEmJogo')} />
                        <CardRuntime configuracao={configuracaoInicial} carregando={carregando} erro={erro} aoEditar={() => setAba('runtime')} />
                    </div>
                </div>
            </ConteudoForm.AreaCorpo>

            <ConteudoForm.AreaBotoes>
                <button type="button" data-variante={partida.desabilitada ? undefined : 'perigo'} onClick={() => void alternarDesabilitada(!partida.desabilitada)} disabled={salvando}>
                    {partida.desabilitada ? 'Reabilitar Partida' : 'Desabilitar Partida'}
                </button>
            </ConteudoForm.AreaBotoes>
        </ConteudoForm>
    );
};

function CardArteCapa({ nome, arteCapa, aoEditar }: { nome: string; arteCapa: ArteCapaDaPartida | null; aoEditar: () => void; }) {
    const imagem = useImagemCapaArte(arteCapa?.idProjeto ?? null);

    return (
        <section className={styles.cartao}>
            <header className={styles.cabecalho}>
                <h3 className={styles.titulo}>Item no Orbital</h3>
                <button type="button" className={styles.botao_editar} onClick={aoEditar}>{arteCapa === null ? 'Definir' : 'Editar'}</button>
            </header>
            <div className={styles.previa_orbital}>
                <ItemPartidaOrbital className={styles.item_orbital} nome={nome} imagemBase64={imagem} encaixe={arteCapa?.encaixe} />
            </div>
            {arteCapa === null && <p className={styles.dica}>Nenhuma Arte de Capa definida — o item aparece só com o nome.</p>}
        </section>
    );
};

function CardMusica({ idMusica, aoEditar }: { idMusica: number | null; aoEditar: () => void; }) {
    return (
        <section className={styles.cartao}>
            <header className={styles.cabecalho}>
                <h3 className={styles.titulo}>Música de Fundo</h3>
                <button type="button" className={styles.botao_editar} onClick={aoEditar}>{idMusica === null ? 'Definir' : 'Editar'}</button>
            </header>
            <PreviewMusicaConfigurada idMusica={idMusica} />
        </section>
    );
};

function CardMusicaEmJogo({ idMusica, aoEditar }: { idMusica: number | null; aoEditar: () => void; }) {
    return (
        <section className={styles.cartao}>
            <header className={styles.cabecalho}>
                <h3 className={styles.titulo}>Música em Jogo</h3>
                <button type="button" className={styles.botao_editar} onClick={aoEditar}>{idMusica === null ? 'Definir' : 'Editar'}</button>
            </header>
            <PreviewMusicaConfigurada idMusica={idMusica} />
        </section>
    );
};

function CardRuntime({ configuracao, carregando, erro, aoEditar }: { configuracao: ConfiguracaoPartida | null; carregando: string | null; erro: string | null; aoEditar: () => void; }) {
    return (
        <section className={styles.cartao}>
            <header className={styles.cabecalho}>
                <h3 className={styles.titulo}>Runtime</h3>
                <button type="button" className={styles.botao_editar} onClick={aoEditar}>Editar</button>
            </header>
            {carregando
                ? <p className={styles.dica}>{carregando}…</p>
                : erro
                    ? <p className={styles.dica}>{erro}</p>
                    : configuracao === null
                        ? <p className={styles.dica}>Runtime ainda não configurado.</p>
                        : (
                            <dl className={styles.resumo}>
                                <div className={styles.resumo_linha}><dt>Cenário</dt><dd>{configuracao.cenario.nome || '—'}</dd></div>
                                <div className={styles.resumo_linha}><dt>Seres</dt><dd>{configuracao.interagiveis.filter(interagivel => interagivel.tipo === 'ser').length}</dd></div>
                                <div className={styles.resumo_linha}><dt>Objetos</dt><dd>{configuracao.interagiveis.filter(interagivel => interagivel.tipo === 'objeto').length}</dd></div>
                                <div className={styles.resumo_linha}><dt>Descobertas</dt><dd>{configuracao.interagiveis.reduce((total, interagivel) => total + interagivel.descobertas.length, 0)}</dd></div>
                            </dl>
                        )}
        </section>
    );
};