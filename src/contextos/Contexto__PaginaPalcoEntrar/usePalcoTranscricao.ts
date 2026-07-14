'use client';

import { useEffect, useRef } from 'react';
import { Eventos_Envia } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';

// Tipagem mínima da Web Speech API (ausente do lib.dom no target atual; Chrome expõe via webkitSpeechRecognition).
interface AlternativaReconhecimentoFala { transcript: string };
interface ResultadoReconhecimentoFala { isFinal: boolean; 0: AlternativaReconhecimentoFala };
interface EventoResultadoReconhecimentoFala { resultIndex: number; results: { length: number; [indice: number]: ResultadoReconhecimentoFala } };
interface EventoErroReconhecimentoFala { error: string };
interface ReconhecimentoFala { lang: string; continuous: boolean; interimResults: boolean; onresult: ((evento: EventoResultadoReconhecimentoFala) => void) | null; onend: (() => void) | null; onerror: ((evento: EventoErroReconhecimentoFala) => void) | null; start: () => void; stop: () => void };
type ConstrutorReconhecimentoFala = new () => ReconhecimentoFala;

declare global { interface Window { SpeechRecognition?: ConstrutorReconhecimentoFala; webkitSpeechRecognition?: ConstrutorReconhecimentoFala } }

// Protótipo de transcrição: o falante transcreve a própria fala no browser (Web Speech) e reporta pelo contrato do Palco.
// seq identifica a frase para o backend: parciais com o mesmo seq substituem o texto até o resultado final selar.
// ativo=false desliga a captura (ex.: comandante que não é falante) sem desmontar o chamador.
export function usePalcoTranscricao({ codigoPalco, adicionaLog, ativo = true }: { codigoPalco: string; adicionaLog: (mensagem: string) => void; ativo?: boolean; }) {
    const proximoSeqRef = useRef(0);
    const adicionaLogRef = useRef(adicionaLog);
    adicionaLogRef.current = adicionaLog;

    useEffect(() => {
        if (!ativo) return;

        const Construtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
        if (!Construtor) { adicionaLogRef.current('Transcrição indisponível neste navegador — use Chrome no desktop.'); return; }

        let encerrado = false;
        let seqBase = proximoSeqRef.current;
        const reconhecimento = new Construtor();
        reconhecimento.lang = 'pt-BR';
        reconhecimento.continuous = true;
        reconhecimento.interimResults = true;

        reconhecimento.onresult = evento => {
            for (let i = evento.resultIndex; i < evento.results.length; i++) {
                const resultado = evento.results[i];
                const texto = resultado[0].transcript.trim();
                if (!texto) continue;
                const seq = seqBase + i;
                if (seq >= proximoSeqRef.current) proximoSeqRef.current = seq + 1;
                eventoWs(Eventos_Envia.Palco.eventos.relatarTranscricao, { codigoPalco, seq, texto, parcial: !resultado.isFinal });
            }
        };

        reconhecimento.onerror = evento => {
            if (evento.error === 'not-allowed' || evento.error === 'service-not-allowed') { encerrado = true; adicionaLogRef.current('Transcrição desativada — sem permissão de microfone.'); };
        };

        // O reconhecimento para sozinho (silêncio/limite do serviço); religa com uma base nova de seq enquanto o falante estiver ativo.
        reconhecimento.onend = () => {
            if (encerrado) return;
            seqBase = proximoSeqRef.current;
            try { reconhecimento.start(); } catch (_err) { }
        };

        try {
            reconhecimento.start();
            adicionaLogRef.current('Transcrição ao vivo ativada.');
        } catch (_err) {
            adicionaLogRef.current('Não foi possível iniciar a transcrição.');
            return;
        }

        return () => {
            encerrado = true;
            reconhecimento.onresult = null;
            reconhecimento.onend = null;
            reconhecimento.stop();
        };
    }, [ativo, codigoPalco]);
};