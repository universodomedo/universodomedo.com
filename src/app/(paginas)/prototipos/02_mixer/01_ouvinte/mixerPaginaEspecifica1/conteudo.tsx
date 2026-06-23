'use client';

import { useEffect, useRef, useState } from 'react';
import { Eventos_EnviaERecebe, type RESPONSE__Mixer_verificarEstado } from 'types-nora-api';

import { eventoWs, useSocketEpoch } from 'Hooks/useEventoWs';
import { getImageUrl } from 'Uteis/ImagemLoader/ImagemLoader';
import styles from './styles.module.css';

type ResultadoFaixa = { tipo: 'ok'; url: string } | { tipo: 'semFaixa' } | { tipo: 'erro' };

function buscarFaixaDoBackend(): Promise<ResultadoFaixa> {
    return new Promise(resolve => {
        eventoWs(Eventos_EnviaERecebe.Mixer.eventos.verificarEstado, {}, { onSuccess: (estado: RESPONSE__Mixer_verificarEstado) => resolve(estado.faixa ? { tipo: 'ok', url: getImageUrl(estado.faixa.caminhoArquivo) } : { tipo: 'semFaixa' }), onError: () => resolve({ tipo: 'erro' }), timeoutMs: 8000 });
    });
};

function estadoTexto(urlFaixa: string | null, tocando: boolean): string {
    if (!urlFaixa) return 'Buscando faixa no backend...';
    if (tocando) return 'Tocando em loop';
    return 'Clique em qualquer lugar da página para iniciar o áudio';
};

function usePaginaComMusicaFixaDoBackend() {
    const epoch = useSocketEpoch();
    const refAudio = useRef<HTMLAudioElement | null>(null);
    const [urlFaixa, setUrlFaixa] = useState<string | null>(null);
    const [tocando, setTocando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    // refaz o verificarEstado a cada mudança de epoch do socket (auth resolvida / socket conectado), até obter a faixa
    useEffect(() => {
        if (urlFaixa) return;
        let ativo = true;
        buscarFaixaDoBackend().then(resultado => {
            if (!ativo) return;
            if (resultado.tipo === 'ok') { setErro(null); setUrlFaixa(resultado.url); console.log('[mixerPaginaEspecifica1] faixa do backend:', resultado.url); return; }
            if (resultado.tipo === 'semFaixa') { setErro('O Mixer do backend não tem nenhuma faixa configurada'); return; }
            setErro('Falha ao consultar o estado do Mixer');
        });
        return () => { ativo = false; };
    }, [epoch, urlFaixa]);

    useEffect(() => {
        if (!urlFaixa) return;
        const audio = new Audio(urlFaixa);
        audio.loop = true;
        audio.preload = 'auto';
        refAudio.current = audio;
        const aoErro = () => setErro('Não foi possível carregar o arquivo da faixa');
        const tentarTocar = () => {
            audio.play().then(() => {
                setTocando(true);
                window.removeEventListener('pointerdown', tentarTocar);
                window.removeEventListener('keydown', tentarTocar);
            }).catch(() => console.log('[mixerPaginaEspecifica1] autoplay bloqueado, aguardando primeiro gesto'));
        };
        audio.addEventListener('error', aoErro);
        // Caso 1: ao receber a faixa, toca em loop; se o autoplay for bloqueado, o primeiro gesto do usuário na página inicia
        tentarTocar();
        window.addEventListener('pointerdown', tentarTocar);
        window.addEventListener('keydown', tentarTocar);
        return () => { audio.pause(); audio.removeEventListener('error', aoErro); window.removeEventListener('pointerdown', tentarTocar); window.removeEventListener('keydown', tentarTocar); refAudio.current = null; };
    }, [urlFaixa]);

    return { urlFaixa, tocando, erro };
};

export function Componente_ConteudoPrototipo() {
    const { urlFaixa, tocando, erro } = usePaginaComMusicaFixaDoBackend();

    return (
        <section className={styles.painel}>
            <span className={styles.rotulo}>Música de fundo desta página (vinda do backend)</span>
            <span className={styles.estado}>{erro ? 'Não foi possível tocar a música' : estadoTexto(urlFaixa, tocando)}</span>
            {erro ? <p className={styles.erro}>{erro}</p> : null}
        </section>
    );
};
