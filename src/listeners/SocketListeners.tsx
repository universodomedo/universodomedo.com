'use client';

import { useEffect, useState } from 'react';

import InicializadorSocket from 'Componentes/Elementos/InicializadorSocket/InicializadorSocket';
import { useUsuariosSocket } from 'listeners/usuariosSocket';
import { useChatSocketListeners } from 'listeners/chatsSocket';
import { getSocket } from 'Hooks/useEventoWs';

type SocketStatus = 'loading' | 'ready' | 'error';

function SocketHooks() {
    InicializadorSocket();
    useUsuariosSocket(); // obtem todos os usuarios, referenciados nos avatares do chat
    useChatSocketListeners(); // socket para carregar salas e conteudo
    return null;
}

export default function SocketListeners() {
    const [mounted, setMounted] = useState(false);
    const [status, setStatus] = useState<SocketStatus>('loading');

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const socket = getSocket();

        // se por algum motivo n conseguir obter o socket, já considera erro
        if (!socket) {
            setStatus('error');
            return;
        }

        // se já estiver conectado (ex: navegação client-side), libera direto
        if (socket.connected) {
            setStatus('ready');
            return;
        }

        setStatus('loading');

        const onConnect = () => {
            setStatus('ready');
        };

        const onConnectError = (err: unknown) => {
            console.error('[SocketListeners] Erro no handshake do socket:', err);
            setStatus('error');
        };

        socket.on('connect', onConnect);
        socket.on('connect_error', onConnectError);

        // timeout de segurança para handshake demorado
        const timeoutId = setTimeout(() => {
            if (!socket.connected) {
                console.error('[SocketListeners] Timeout ao tentar sincronizar via WebSocket.');
                setStatus('error');
            }
        }, 10000); // 10 segundos (ajusta se quiser)

        return () => {
            clearTimeout(timeoutId);
            socket.off('connect', onConnect);
            socket.off('connect_error', onConnectError);
        };
    }, [mounted]);

    // enquanto não montou no client, não rende nada (evita SSR usar window/cookies)
    if (!mounted) return null;

    if (status === 'loading') {
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000',
                color: '#fff',
                fontFamily: 'sans-serif',
                zIndex: 9999
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: 12, fontSize: 18 }}>
                        Sincronizando com o servidor...
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                        Estabelecendo conexão em tempo real
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000',
                color: '#fff',
                fontFamily: 'sans-serif',
                zIndex: 9999
            }}>
                <div style={{ textAlign: 'center', maxWidth: 420, padding: 16 }}>
                    <div style={{ marginBottom: 12, fontSize: 18, fontWeight: 'bold' }}>
                        Algo deu errado na sincronização
                    </div>
                    <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 16 }}>
                        Não foi possível estabelecer a conexão em tempo real com o servidor.
                        Tente recarregar a página. Se o problema persistir, verifique sua conexão
                        ou tente novamente mais tarde.
                    </div>
                    <button
                        type="button"
                        onClick={() => { window.location.reload(); }}
                        style={{
                            padding: '8px 16px',
                            borderRadius: 4,
                            border: '1px solid #fff',
                            background: 'transparent',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: 14
                        }}
                    >
                        Recarregar página
                    </button>
                </div>
            </div>
        );
    }

    // status === 'ready' → socket pronto, pode registrar todos os listeners normalmente
    return <SocketHooks />;
}