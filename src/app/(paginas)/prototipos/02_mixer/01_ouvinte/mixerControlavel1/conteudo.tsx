"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

const URL_FAIXA = "/prototipos/02_mixer/musica-pagina-1.mp3";
const NOME_FAIXA = "Música da Página 1";

function formatarTempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const resto = Math.floor(segundos % 60).toString().padStart(2, "0");
    return `${minutos}:${resto}`;
};

function usePaginaComMusicaFixa(urlFaixa: string) {
    const refAudio = useRef<HTMLAudioElement | null>(null);
    const [desbloqueado, setDesbloqueado] = useState(false);
    const [tocando, setTocando] = useState(false);
    const [tempoAtual, setTempoAtual] = useState(0);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        const audio = new Audio(urlFaixa);
        audio.loop = true;
        audio.preload = "auto";
        refAudio.current = audio;
        const aoAtualizarTempo = () => setTempoAtual(audio.currentTime);
        const aoErro = () => setErro("Não foi possível carregar a faixa (arquivo ausente em public?)");
        audio.addEventListener("timeupdate", aoAtualizarTempo);
        audio.addEventListener("error", aoErro);
        // Caso 1: ao entrar, tenta tocar a faixa fixa da página; se o navegador bloquear o autoplay, espera o gesto inicial
        audio.play().then(() => { setDesbloqueado(true); setTocando(true); }).catch(() => console.log("[mixerControlavel1] autoplay bloqueado, aguardando gesto inicial"));
        return () => { audio.pause(); audio.removeEventListener("timeupdate", aoAtualizarTempo); audio.removeEventListener("error", aoErro); refAudio.current = null; };
    }, [urlFaixa]);

    async function entrarNoAudio() {
        const audio = refAudio.current;
        if (!audio) return;
        try {
            await audio.play();
            setDesbloqueado(true);
            setTocando(true);
            setErro(null);
        } catch (e) {
            setErro(e instanceof Error ? e.message : "Falha ao iniciar o áudio");
            console.log("[mixerControlavel1] gesto não conseguiu iniciar o áudio");
        }
    };

    function alternar() {
        const audio = refAudio.current;
        if (!audio) return;
        if (audio.paused) { audio.play(); setTocando(true); } else { audio.pause(); setTocando(false); }
    };

    return { desbloqueado, tocando, tempoAtual, erro, entrarNoAudio, alternar };
};

export function Componente_ConteudoPrototipo() {
    const { desbloqueado, tocando, tempoAtual, erro, entrarNoAudio, alternar } = usePaginaComMusicaFixa(URL_FAIXA);

    return (
        <section className={styles.painel}>
            <div className={styles.linhaFaixa}>
                <span className={styles.rotulo}>Faixa fixa da página</span>
                <span className={styles.nomeFaixa}>{NOME_FAIXA}</span>
            </div>

            {!desbloqueado ? (
                <button className={styles.botaoEntrar} onClick={entrarNoAudio}>Entrar no áudio da página</button>
            ) : (
                <div className={styles.controles}>
                    <button className={styles.botaoControle} onClick={alternar}>{tocando ? "Pausar" : "Retomar"}</button>
                    <span className={styles.estado}>{tocando ? "Tocando em loop" : "Pausado"}</span>
                    <span className={styles.tempo}>{formatarTempo(tempoAtual)}</span>
                </div>
            )}

            {erro ? <p className={styles.erro}>{erro}</p> : null}
        </section>
    );
};
