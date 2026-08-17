'use client';

import { useEffect, useRef } from 'react';

type TurnstileGlobal = { render: (elemento: HTMLElement, opcoes: { sitekey: string; callback: (token: string) => void; 'expired-callback': () => void; theme: 'dark' | 'light' | 'auto'; appearance: 'always' | 'execute' | 'interaction-only' }) => string };

type JanelaComTurnstile = Window & { turnstile?: TurnstileGlobal; __aoCarregarTurnstile?: () => void };

const URL_SCRIPT_TURNSTILE = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

/** Widget managed do Cloudflare Turnstile: emite o token anti-robô via aoMudarToken quando o desafio resolve (invisível na maioria dos casos). Sem NEXT_PUBLIC_TURNSTILE_SITE_KEY no ambiente, não renderiza nada — a site key do front e a TURNSTILE_SECRET_KEY do backend andam juntas por ambiente. */
export default function CampoTurnstile({ aoMudarToken }: { aoMudarToken: (token: string | null) => void }) {
    const recipienteRef = useRef<HTMLDivElement | null>(null);
    const jaRenderizouRef = useRef(false);

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

    useEffect(() => {
        if (siteKey === '' || jaRenderizouRef.current) return;

        const janela = window as JanelaComTurnstile;

        const renderiza = () => {
            if (!janela.turnstile || recipienteRef.current === null || jaRenderizouRef.current) return;
            jaRenderizouRef.current = true;
            // appearance interaction-only: o widget só ocupa espaço na tela quando o desafio exige interação humana; no caso normal resolve invisível e não empurra o layout.
            janela.turnstile.render(recipienteRef.current, { sitekey: siteKey, callback: token => aoMudarToken(token), 'expired-callback': () => aoMudarToken(null), theme: 'dark', appearance: 'interaction-only' });
        };

        if (janela.turnstile) { renderiza(); return; }

        janela.__aoCarregarTurnstile = renderiza;

        if (document.querySelector(`script[src^="${URL_SCRIPT_TURNSTILE}"]`) === null) {
            const script = document.createElement('script');
            script.src = `${URL_SCRIPT_TURNSTILE}?onload=__aoCarregarTurnstile`;
            script.async = true;
            document.head.appendChild(script);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteKey]);

    if (siteKey === '') return null;

    return <div ref={recipienteRef} />;
};