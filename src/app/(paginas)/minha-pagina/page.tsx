'use client';

import styles from './styles.module.css';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import BarraUsuario from 'Componentes/ElementosPaginaUsuario/BarraUsuario/page.tsx';
import SecaoPosts from 'Componentes/ElementosPaginaUsuario/Post/page.tsx';
import SecaoContatos from 'Componentes/ElementosPaginaUsuario/Contato/page.tsx';


//
import { useEffect, useState } from 'react';
import { getSocket } from 'Libs/socket';

//

export default function MinhaPagina() {
    return (
        <ControladorSlot pageConfig={{ paginaAtual: PAGINAS.MINHA_PAGINA, comCabecalho: false, usuarioObrigatorio: true }}>
            <MinhaPagina_Slot />
        </ControladorSlot>
    );
};

function MinhaPagina_Slot() {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);

    const addMessage = (message: string) => {
        setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    useEffect(() => {
        addMessage('🔗 Conectando com namespace /gameEngine...');

        // ✅ Usar COM namespace
        const socket = getSocket('/gameEngine');

        socket.on('connect', () => {
            setIsConnected(true);
            addMessage('✅ Conectado ao namespace /gameEngine!');
            addMessage(`🆔 Socket ID: ${socket.id}`);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            addMessage('❌ Desconectado');
        });

        socket.on('connect_error', (error: Error) => {
            addMessage(`🚨 Erro: ${error.message}`);
        });

        return () => {
            // Não desconecta - deixa o centralizador gerenciar
        };
    }, []);

    const testarEvento = async (evento: string, dados: any = {}) => {
        try {
            addMessage(`🔄 Enviando ${evento}...`);
            const socket = getSocket('/gameEngine'); // ✅ Sempre usar namespace

            const response = await socket.emitWithAck(evento, {
                ...dados,
                timestamp: new Date().toISOString(),
                source: 'com-namespace'
            });

            addMessage(`✅ ${evento}: ${response.teste}`);
            return response;
        } catch (error) {
            addMessage(`❌ Erro no ${evento}: ${error}`);
            throw error;
        }
    };

    return (
        <div id={styles.portal_usuario}>
            <div id={styles.portal_usuario_esquerda}>
                <BarraUsuario />
                <SecaoPosts />

                <div style={{ padding: '20px' }}>
                    <h1>🔌 Teste COM Namespace /gameEngine</h1>
                    <p>Status: <strong>{isConnected ? '🟢 Conectado' : '🔴 Desconectado'}</strong></p>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => testarEvento('teste', { teste: 'ping-com-namespace' })}
                            disabled={!isConnected}
                        >
                            Testar Ping
                        </button>
                    </div>

                    <div style={{
                        backgroundColor: '#000000',
                        padding: '15px',
                        borderRadius: '5px',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        height: '400px',
                        overflowY: 'auto'
                    }}>
                        {messages.map((msg, i) => (
                            <div key={i}>{msg}</div>
                        ))}
                    </div>

                    <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
                        <strong>Namespace:</strong> /gameEngine<br />
                        <strong>Gateway:</strong> WebSocketTestGateway<br />
                        <strong>Porta:</strong> 3200
                    </div>
                </div>
            </div>

            {/* <SecaoContatos /> */}
        </div>
    );
};