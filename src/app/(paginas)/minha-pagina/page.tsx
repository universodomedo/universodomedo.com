'use client';

import styles from './styles.module.css';

import { useEffect, useState } from 'react';
import { PAGINAS, Eventos_RecebeEnvia } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import BarraUsuario from 'Componentes/ElementosPaginaUsuario/BarraUsuario/page.tsx';
import SecaoPosts from 'Componentes/ElementosPaginaUsuario/Post/page.tsx';
// import SecaoContatos from 'Componentes/ElementosPaginaUsuario/Contato/page.tsx';

import { useEventoWs } from 'Hooks/useEventoWs'; // ajusta o path se for diferente

export default function MinhaPagina() {
    return (
        <ControladorSlot
            pageConfig={{
                paginaAtual: PAGINAS.MINHA_PAGINA,
                comCabecalho: false,
                usuarioObrigatorio: true,
            }}
        >
            <MinhaPagina_Slot />
        </ControladorSlot>
    );
}

function MinhaPagina_Slot() {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);

    console.log('🎯 [MinhaPagina_Slot] Renderizando...');

    const addMessage = (message: string) => {
        setMessages((prev) => [
            ...prev,
            `${new Date().toLocaleTimeString()}: ${message}`,
        ]);
    };

    // nosso hook central de WS
    const { socket, eventoWs } = useEventoWs();

    // logs de conexão, usando só o socket do hook
    useEffect(() => {
        console.log('🎯 [useEffect] Configurando socket...');
        addMessage('🔗 Conectando com namespace...');

        const handleConnect = () => {
            setIsConnected(true);
            addMessage('✅ Conectado ao namespace /!');
            addMessage(`🆔 Socket ID: ${socket.id}`);
        };

        const handleDisconnect = () => {
            setIsConnected(false);
            addMessage('❌ Desconectado');
        };

        const handleConnectError = (error: Error) => {
            addMessage(`🚨 Erro: ${error.message}`);
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('connect_error', handleConnectError);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('connect_error', handleConnectError);
            // não desconecta aqui – o centralizador cuida disso
        };
    }, [socket]);

    //
    // HANDLERS ESPECÍFICOS POR BOTÃO
    //

    const handleTesteGameEngine1 = async () => {
        const def = Eventos_RecebeEnvia.GameEngine.eventos.testeGameEngine1;

        try {
            addMessage(`🔄 Enviando ${def.fullName}...`);

            const response = await eventoWs(Eventos_RecebeEnvia.GameEngine.eventos.testeGameEngine1, {
                teste1: 'ping-com-namespace',
            });

            addMessage(`✅ ${def.fullName}: ${JSON.stringify(response)}`);
        } catch (error) {
            addMessage(`❌ Erro em ${def.fullName}: ${String(error)}`);
        }
    };

    const handleTesteChat1 = async () => {
        const def = Eventos_RecebeEnvia.Chat.eventos.testeChat1;

        try {
            addMessage(`🔄 Enviando ${def.fullName}...`);

            const response = await eventoWs(def, {
                mensagem: 'ping-com-namespace',
            });

            addMessage(`✅ ${def.fullName}: ${JSON.stringify(response)}`);
        } catch (error) {
            addMessage(`❌ Erro em ${def.fullName}: ${String(error)}`);
        }
    };

    const handleTesteGameEngineDuplicado = async () => {
        const def = Eventos_RecebeEnvia.GameEngine.eventos.testeDuplicado;

        try {
            addMessage(`🔄 Enviando ${def.fullName}...`);

            const response = await eventoWs(def, {});

            addMessage(`✅ ${def.fullName}: ${JSON.stringify(response)}`);
        } catch (error) {
            addMessage(`❌ Erro em ${def.fullName}: ${String(error)}`);
        }
    };

    const handleTesteChatDuplicado = async () => {
        const def = Eventos_RecebeEnvia.Chat.eventos.testeDuplicado;

        try {
            addMessage(`🔄 Enviando ${def.fullName}...`);

            const response = await eventoWs(def, {});

            addMessage(`✅ ${def.fullName}: ${JSON.stringify(response)}`);
        } catch (error) {
            addMessage(`❌ Erro em ${def.fullName}: ${String(error)}`);
        }
    };

    return (
        <div id={styles.portal_usuario}>
            <div id={styles.portal_usuario_esquerda}>
                <BarraUsuario />
                <SecaoPosts />

                <div style={{ padding: '20px' }}>
                    <h1>🔌 Teste COM Namespace /</h1>
                    <p>
                        Status:{' '}
                        <strong>{isConnected ? '🟢 Conectado' : '🔴 Desconectado'}</strong>
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            marginBottom: '20px',
                            flexWrap: 'wrap',
                        }}
                    >
                        <button onClick={handleTesteGameEngine1} disabled={!isConnected}>
                            Teste GameEngine1
                        </button>

                        <button onClick={handleTesteChat1} disabled={!isConnected}>
                            Teste Chat1
                        </button>

                        <button
                            onClick={handleTesteGameEngineDuplicado}
                            disabled={!isConnected}
                        >
                            Teste GameEngine Duplicado
                        </button>

                        <button
                            onClick={handleTesteChatDuplicado}
                            disabled={!isConnected}
                        >
                            Teste Chat Duplicado
                        </button>
                    </div>

                    <div
                        style={{
                            backgroundColor: '#000000',
                            padding: '15px',
                            borderRadius: '5px',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            height: '400px',
                            overflowY: 'auto',
                        }}
                    >
                        {messages.map((msg, i) => (
                            <div key={i}>{msg}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* <SecaoContatos /> */}
        </div>
    );
}