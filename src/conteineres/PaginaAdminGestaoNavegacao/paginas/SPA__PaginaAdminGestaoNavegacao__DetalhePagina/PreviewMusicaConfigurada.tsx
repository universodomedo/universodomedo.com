'use client';

import styles from './previewMusicaConfigurada.module.css';

import { useEffect } from 'react';

import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';
import { useDefinirMusicaSobreposicao } from 'Hooks/useDefinirMusicaPagina';
import { useAppSelector } from 'Redux/hooks/useRedux';
import { selectIdMusicaSobreposicao } from 'Redux/selectors/audioPaginaSelectors';

const SELECT_MUSICA = { nome: true, fonteMusica: { nome: true } } as const;

// Preview só-leitura da música configurada: clicar manda a música pra Central de Áudio como SOBREPOSIÇÃO ("por cima") — interrompe a atual e toca esta; clicar de novo volta pra música da página. Sem edição — o "Definir/Editar" do card leva ao seletor.
export function PreviewMusicaConfigurada({ idMusica }: { idMusica: number | null }) {
    if (idMusica === null) return <p className={styles.vazio}>Nenhuma música de fundo definida.</p>;

    return <BlocoMusica key={idMusica} idMusica={idMusica} />;
};

function BlocoMusica({ idMusica }: { idMusica: number }) {
    const definirSobreposicao = useDefinirMusicaSobreposicao();
    const idSobreposicao = useAppSelector(selectIdMusicaSobreposicao);
    const tocando = idSobreposicao === idMusica;
    const consulta = useNoraGraphQLRegistro('MusicaConfigurada', {
        props: { idMusica },
        pk: idMusica,
        select: SELECT_MUSICA,
        carregando: 'Carregando música',
        mensagemErro: 'Não foi possível carregar a música de fundo.',
    });
    const musica = consulta.data;

    // Ao sair da visão, remove o overlay (volta pra música da página) — como o Orbital faz ao sair.
    useEffect(() => () => { definirSobreposicao(null, null); }, [definirSobreposicao]);

    function alterna(): void {
        if (!musica) return;
        if (tocando) definirSobreposicao(null, null);
        else definirSobreposicao(idMusica, musica.nome);
    };

    if (consulta.carregando) return <p className={styles.vazio}>{consulta.carregando}…</p>;
    if (consulta.erro || !musica) return <p className={styles.vazio}>{consulta.erro ?? 'Música não encontrada.'}</p>;

    return (
        <button type="button" className={`${styles.bloco} ${tocando ? styles.bloco_tocando : ''}`} onClick={alterna} title={tocando ? 'Parar (volta à música da página)' : 'Tocar por cima na Central de Áudio'}>
            <span className={styles.icone} aria-hidden="true">{tocando ? '❚❚' : '▶'}</span>
            <span className={styles.info}>
                <strong className={styles.nome}>{musica.nome}</strong>
                <span className={styles.fonte}>{musica.fonteMusica.nome}</span>
            </span>
        </button>
    );
};