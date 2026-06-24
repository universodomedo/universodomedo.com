'use client';

import { useEffect } from 'react';
import { MIXER_CANAL_CONTROLAVEL_2 } from 'types-nora-api';

import { useDefinirMusicaPagina } from 'Hooks/useDefinirMusicaPagina';
import { useMixerCanal } from '../../_compartilhado/useMixerCanal';
import styles from './styles.module.css';

const TITULO_CANAL = 'Sala Controlável 2';

// Caso 5 (ouvinte): a musica deste canal e escolhida AO VIVO pelo controlador. O ouvinte so reflete a selecao
// recebida por WS no SSOT de audio (definirMusicaPagina) — reproducao/crossfade/Central vem inteiros da base.
export function Componente_ConteudoPrototipo() {
    const { selecao } = useMixerCanal(MIXER_CANAL_CONTROLAVEL_2);
    const definirMusicaPagina = useDefinirMusicaPagina();
    const idMusica = selecao?.idMusicaConfigurada ?? null;

    useEffect(() => { definirMusicaPagina(idMusica, idMusica != null ? TITULO_CANAL : null); }, [definirMusicaPagina, idMusica]);
    useEffect(() => () => { definirMusicaPagina(null, null); }, [definirMusicaPagina]);

    return (
        <section className={styles.painel}>
            <span className={styles.rotulo}>Canal ao vivo</span>
            <span className={styles.estado}>{idMusica != null ? `Recebendo a música #${idMusica} do controlador` : 'Em silêncio — aguardando o controlador'}</span>
            <p className={styles.dica}>Nome, fonte e volume aparecem na Central de Áudio. Abra o controlador deste canal em outra aba para comandar o que toca aqui.</p>
        </section>
    );
};
