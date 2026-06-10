'use client';

import { useEffect, useState } from 'react';

import InicializadorSocket from 'Componentes/Elementos/InicializadorSocket/InicializadorSocket';
import { useUsuariosSocket } from 'Listeners/usuariosSocket';
import { useChatSocketListeners } from 'Listeners/chatsSocket';
import { useEventosUsuarioSocket } from 'Listeners/eventosUsuarioSocket';
import { useTutorialAberturaSocket } from 'Listeners/tutorialAberturaSocket';
import { getSocket, setSocketAuthState, clearSocketCache } from 'Hooks/useEventoWs';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

type SocketStatus = 'loading' | 'ready' | 'error';

export default function SocketListeners() {
    const [mounted, setMounted] = useState(false);
    const [status, setStatus] = useState<SocketStatus>('ready');
    const { carregando, estaAutenticado } = useContextoAutenticacao();

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!mounted) return;

        if (carregando) {
            setSocketAuthState(false, false);
            setStatus('ready');
            return;
        }

        setSocketAuthState(estaAutenticado, true);

        if (!estaAutenticado) {
            clearSocketCache();
            setStatus('ready');
            return;
        }

        InicializadorSocket();

        const socket = getSocket();

        if (!socket) {
            setStatus('error');
            return;
        }

        if (socket.connected) {
            setStatus('ready');
            return;
        }

        setStatus('loading');

        const onConnect = () => { setStatus('ready'); };
        const onConnectError = (err: unknown) => { console.error('[SocketListeners] Erro no handshake do socket:', err); setStatus('error'); };

        socket.once('connect', onConnect);
        socket.once('connect_error', onConnectError);

        try { socket.connect(); } catch (err) { console.error('[SocketListeners] Erro ao chamar socket.connect():', err); setStatus('error'); }

        const timeoutId = window.setTimeout(() => {
            if (!socket.connected) {
                console.error('[SocketListeners] Timeout ao tentar sincronizar via WebSocket.');
                setStatus('error');
            }
        }, 10000);

        return () => {
            window.clearTimeout(timeoutId);
            socket.off('connect', onConnect);
            socket.off('connect_error', onConnectError);
        };
    }, [mounted, carregando, estaAutenticado]);

    if (!mounted) return null;

    if (!carregando && estaAutenticado && status === 'loading') {
        return (
            <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif', zIndex: 9999 }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 12, fontSize: 18 }}>Sincronizando com o servidor...</div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>Estabelecendo conexão em tempo real</div>
                </div>
            </div>
        );
    }

    if (!carregando && estaAutenticado && status === 'error') {
        return (
            <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif', zIndex: 9999 }}>
                <div style={{ textAlign: 'center', maxWidth: 420, padding: 16 }}>
                    <div style={{ marginBottom: 12, fontSize: 18, fontWeight: 'bold' }}>Algo deu errado na sincronização</div>
                    <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 16 }}>
                        Não foi possível estabelecer a conexão em tempo real com o servidor.
                        Tente recarregar a página. Se o problema persistir, verifique sua conexão
                        ou tente novamente mais tarde.
                    </div>
                    <button type="button" onClick={() => { window.location.reload(); }} style={{ padding: '8px 16px', borderRadius: 4, border: '1px solid #fff', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: 14 }}>
                        Recarregar página
                    </button>
                </div>
            </div>
        );
    }

    if (carregando) return null;
    if (!estaAutenticado) return null;

    return <SocketHooks />;
};

function SocketHooks() {
    useUsuariosSocket();
    useChatSocketListeners();
    useEventosUsuarioSocket();
    useTutorialAberturaSocket();
    return null;
};