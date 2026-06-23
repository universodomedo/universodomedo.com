'use client';

import { useEffect, useRef, useState } from 'react';

import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';
import { getImageUrl } from 'Uteis/ImagemLoader/ImagemLoader';
import styles from './styles.module.css';

const ID_MUSICA_PAGINA = 2; // música pré-definida desta página (Page 2 = arquivo_tipado_musica id 2, diferente da Page 1)
const SELECT_MUSICA = { id: true, arquivo: { id: true, caminhoArquivo: true } } as const;

function estadoTexto(urlFaixa: string | null, tocando: boolean): string {
    if (!urlFaixa) return 'Buscando faixa no backend...';
    if (tocando) return 'Tocando em loop';
    return 'Clique em qualquer lugar da página para iniciar o áudio';
};

export function Componente_ConteudoPrototipo() {
    const registroMusica = useNoraGraphQLRegistro('ArquivoTipadoMusica', { props: { idMusica: ID_MUSICA_PAGINA }, pk: ID_MUSICA_PAGINA, select: SELECT_MUSICA, carregando: 'Buscando faixa no backend', mensagemErro: 'Não foi possível carregar a música desta página' });
    const caminhoArquivo = registroMusica.data?.arquivo?.caminhoArquivo ?? null;
    const urlFaixa = caminhoArquivo ? getImageUrl(caminhoArquivo) : null;

    const refAudio = useRef<HTMLAudioElement | null>(null);
    const [tocando, setTocando] = useState(false);
    const [erroAudio, setErroAudio] = useState<string | null>(null);

    // Caso 1: toca a faixa fixa em loop; se o autoplay for bloqueado, o primeiro gesto do usuário na página inicia
    useEffect(() => {
        if (!urlFaixa) return;
        const tentarTocar = () => { const audio = refAudio.current; if (audio) audio.play().catch(() => undefined); };
        tentarTocar();
        window.addEventListener('pointerdown', tentarTocar);
        window.addEventListener('keydown', tentarTocar);
        console.log('[mixerPaginaEspecifica2] faixa do backend:', urlFaixa);
        return () => { window.removeEventListener('pointerdown', tentarTocar); window.removeEventListener('keydown', tentarTocar); };
    }, [urlFaixa]);

    const erro = registroMusica.erro ?? erroAudio;

    return (
        <section className={styles.painel}>
            {urlFaixa ? <audio ref={refAudio} src={urlFaixa} loop preload="auto" hidden onPlaying={() => setTocando(true)} onPause={() => setTocando(false)} onError={() => setErroAudio('Não foi possível carregar o arquivo da faixa')} /> : null}
            <span className={styles.rotulo}>Música de fundo desta página (vinda do backend)</span>
            <span className={styles.estado}>{erro ? 'Não foi possível tocar a música' : estadoTexto(urlFaixa, tocando)}</span>
            {erro ? <p className={styles.erro}>{erro}</p> : null}
        </section>
    );
};
