'use client';

import styles from './styles.module.css';

import type { ArteCapaDaPartida, ConfiguracaoPartida } from 'types-nora-api';

import { ItemPartidaOrbital } from 'Componentes/ElementosDeJogo/ItemPartidaOrbital/ItemPartidaOrbital';
import { useImagemCapaArte } from 'Funcionalidades/ArteDeCapa/useImagemCapaArte';
import { PreviewMusicaConfigurada } from './PreviewMusicaConfigurada';
import { useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao } from 'Contextos/Contexto__PaginaGameDesignerConfiguracaoPartida__Edicao/contexto';

// Dados de Exibição da Partida: visão só-leitura (nada editável direto). Cada card tem um "Editar" que entra no editor daquele dado.
export default function SPA__PaginaGameDesignerConfiguracaoPartida__Visao() {
    const { partida, configuracaoInicial, carregando, erro, setAba, idMusicaConfigurada } = useContexto__PaginaGameDesignerConfiguracaoPartida__Edicao();

    return (
        <div className={styles.host}>
            <div className={styles.grade}>
                <CardArteCapa nome={partida.nome} arteCapa={partida.arteCapa} aoEditar={() => setAba('arteCapa')} />
                <CardMusica idMusica={idMusicaConfigurada} aoEditar={() => setAba('musica')} />
                <CardRuntime configuracao={configuracaoInicial} carregando={carregando} erro={erro} aoEditar={() => setAba('runtime')} />
            </div>
        </div>
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
                                <div className={styles.resumo_linha}><dt>Controláveis</dt><dd>{configuracao.controlaveis.length}</dd></div>
                                <div className={styles.resumo_linha}><dt>Não-controláveis</dt><dd>{configuracao.naoControlaveis.length}</dd></div>
                                <div className={styles.resumo_linha}><dt>Interagíveis</dt><dd>{configuracao.interagiveis.length}</dd></div>
                                <div className={styles.resumo_linha}><dt>Descobertas</dt><dd>{configuracao.descobertasCondicionadas.length}</dd></div>
                            </dl>
                        )}
        </section>
    );
};
