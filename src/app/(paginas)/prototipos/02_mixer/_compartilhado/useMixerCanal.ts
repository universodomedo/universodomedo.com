'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Eventos_Emite, Eventos_EnviaERecebe, type EMIT__Mixer_selecaoAtualizada, type MixerSelecaoDto, type WsErrorResponse } from 'types-nora-api';

import { eventoWs, useRecebeEmitWs, useSocketEpoch } from 'Hooks/useEventoWs';

// Transporte WS de um canal de controle ao vivo (Caso 5): o controlador define a musica, o ouvinte reflete.
// O ouvinte le `selecao` e reage no SSOT de audio; o controlador usa `definirMusica`. Reativo ao epoch do
// socket (re-join da room a cada (re)conexao, pois rooms do socket.io sao por conexao).
export function useMixerCanal(canal: string) {
    const [selecao, setSelecao] = useState<MixerSelecaoDto | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const epoch = useSocketEpoch();
    const canalRef = useRef(canal);
    canalRef.current = canal;

    useEffect(() => {
        let cancelado = false;
        eventoWs(Eventos_EnviaERecebe.Mixer.eventos.verificarSelecao, { canal }, { onSuccess: (resp: MixerSelecaoDto) => { if (!cancelado) setSelecao(resp); }, onError: () => { }, timeoutMs: 8000 });
        return () => { cancelado = true; };
    }, [canal, epoch]);

    useRecebeEmitWs(Eventos_Emite.Mixer.eventos.selecaoAtualizada, (data: EMIT__Mixer_selecaoAtualizada) => { if (data.canal === canalRef.current) setSelecao(data); });

    const definirMusica = useCallback((idMusicaConfigurada: number | null) => {
        eventoWs(Eventos_EnviaERecebe.Mixer.eventos.admin_definirMusica, { canal, idMusicaConfigurada }, { onSuccess: (resp: MixerSelecaoDto) => { setSelecao(resp); setErro(null); }, onError: (e: WsErrorResponse) => { setErro(e.mensagem); }, timeoutMs: 8000 });
    }, [canal]);

    return { selecao, definirMusica, erro };
};
