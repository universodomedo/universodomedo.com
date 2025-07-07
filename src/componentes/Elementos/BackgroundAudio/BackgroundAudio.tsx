// components/BackgroundAudio.tsx
'use client';

import { useEffect } from 'react';

// Tipagem completa para a API do YouTube
declare namespace YT {
    interface Player {
        playVideo(): void;
        pauseVideo(): void;
        stopVideo(): void;
        setVolume(volume: number): void;
        getVolume(): number;
        mute(): void;
        unMute(): void;
        getPlayerState(): PlayerState;
        getCurrentTime(): number;
        destroy(): void;
        // Métodos adicionais conforme necessário
    }

    type PlayerState = -1 | 0 | 1 | 2 | 3 | 5;

    interface PlayerOptions {
        videoId?: string;
        width?: number | string;
        height?: number | string;
        playerVars?: PlayerVars;
        events?: PlayerEvents;
    }

    interface PlayerVars {
        autoplay?: 0 | 1;
        loop?: 0 | 1;
        controls?: 0 | 1 | 2;
        disablekb?: 0 | 1;
        fs?: 0 | 1;
        modestbranding?: 0 | 1;
        rel?: 0 | 1;
        enablejsapi?: 0 | 1;
    }

    interface PlayerEvents {
        onReady?(event: { target: Player }): void;
        onStateChange?(event: { target: Player; data: PlayerState }): void;
        onError?(event: { target: Player; data: number }): void;
    }
}

declare global {
    interface Window {
        YT: {
            Player: new (elementId: string | HTMLElement, options: YT.PlayerOptions) => YT.Player;
            PlayerState: {
                UNSTARTED: -1;
                ENDED: 0;
                PLAYING: 1;
                PAUSED: 2;
                BUFFERING: 3;
                CUED: 5;
            };
        };
        onYouTubeIframeAPIReady?: () => void;
    }
}

export default function BackgroundAudio() {
    useEffect(() => {
        let player: YT.Player | null = null;
        let checkInterval: NodeJS.Timeout;
        const videoId = 'XqfuaFQzStM'; // Substitua pelo seu ID de vídeo

        // 1. Ativação do contexto de áudio para bypass de restrições
        const activateAudioContext = (): AudioContext => {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = 'triangle';
            gainNode.gain.value = 0; // Totalmente silencioso
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            oscillator.start();

            return ctx;
        };

        // 2. Forçar reprodução de áudio
        const forceAudioPlayback = (): void => {
            const ctx = activateAudioContext();
            const audio = new Audio();
            audio.src = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...';
            audio.loop = true;
            audio.volume = 0.01;

            ctx.resume().then(() => {
                audio.play().catch((e: Error) => {
                    console.log('Erro no áudio silencioso:', e.message);
                });
            });
        };

        // 3. Inicialização do player do YouTube
        const initializePlayer = (): void => {
            forceAudioPlayback();

            const container = document.createElement('div');
            container.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(1px, 1px, 1px, 1px);
        opacity: 0.0001;
        pointer-events: none;
      `;

            document.body.appendChild(container);

            player = new window.YT.Player(container, {
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    loop: 1,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    modestbranding: 1,
                    rel: 0,
                    enablejsapi: 1
                },
                events: {
                    onReady: (event: { target: YT.Player }) => {
                        try {
                            event.target.setVolume(50);
                            event.target.playVideo();

                            checkInterval = setInterval(() => {
                                if (player?.getPlayerState() !== window.YT.PlayerState.PLAYING) {
                                    player?.playVideo();
                                }
                            }, 2000);
                        } catch (error) {
                            console.error('Erro ao iniciar reprodução:', error);
                        }
                    },
                    onStateChange: (event: { target: YT.Player; data: YT.PlayerState }) => {
                        if (event.data === window.YT.PlayerState.ENDED) {
                            event.target.playVideo();
                        }
                    }
                }
            });
        };

        // 4. Carregamento da API do YouTube
        const loadYouTubeAPI = (): void => {
            if (window.YT) {
                initializePlayer();
                return;
            }

            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);

            window.onYouTubeIframeAPIReady = initializePlayer;
        };

        loadYouTubeAPI();

        // 5. Limpeza ao desmontar o componente
        return () => {
            clearInterval(checkInterval);
            window.onYouTubeIframeAPIReady = undefined;

            if (player) {
                try {
                    player.destroy();
                } catch (e) {
                    console.warn('Erro ao destruir player:', e);
                }
            }

            document.querySelectorAll('div[style*="opacity: 0.0001"]').forEach(el => {
                el.remove();
            });
        };
    }, []);

    return null;
}