'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import styles from './styles.module.css';

import ModalPrimeiroAcesso from "Componentes/ElementosDeJogo/ModalPrimeiroAcesso/page";
import BarraUsuario from 'Componentes/ElementosPaginaUsuario/BarraUsuario/page.tsx';
import Post from 'Componentes/ElementosPaginaUsuario/Post/page.tsx';
import Contato from 'Componentes/ElementosPaginaUsuario/Contato/page.tsx';

import { UsuarioDto } from 'types-nora-api';

// Initialize socket
const socket = io('https://nora.universodomedo.com', {
    withCredentials: true,
});

export default function MinhaDisponibilidadeComDados({ dadosMinhaPagina }: { dadosMinhaPagina: UsuarioDto }) {
    if (dadosMinhaPagina?.username === null) {
        return <ModalPrimeiroAcesso />;
    }

    return (
        <div id={styles.portal_usuario}>
            <div id={styles.portal_usuario_esquerda}>
                <BarraUsuario dadosMinhaPagina={dadosMinhaPagina!} />
                <SecaoPosts />
            </div>

            <SecaoContatos />
        </div>
    );
}

function SecaoPosts() {
    const [messages, setMessages] = useState<string[]>([]);  // Use an array to store messages
    const [newMessage, setNewMessage] = useState<string>('');  // State to store the new message input

    useEffect(() => {
        // Listen for messages from the server
        socket.on('message', (data) => {
            console.log('Received:', data);
            setMessages((prevMessages) => [data, ...prevMessages]);  // Prepend new message to the array
        });

        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        if (newMessage.trim()) {
            socket.emit('message', newMessage);  // Send the new message to the server
            setNewMessage('');  // Clear the input field
            console.log('Message sent!');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            sendMessage();  // Trigger the message send when Enter key is pressed
        }
    };

    // parar de mostrar enquanto n funcionando pq pessoal vai usar
    // return <></>;

    return (
        <div id={styles.recipiente_lista_posts}>
            <h1>Nenhuma postagem encontrada</h1>

            {/* Message input and send button */}
            <div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}  // Update the message state as the user types
                    placeholder="Type your message here"
                    className={styles.inputMessage}
                    onKeyDown={handleKeyDown}  // Listen for key press events
                />
                <button onClick={sendMessage} className={styles.sendButton}>Send Message</button>
            </div>

            {/* Display all messages, with the newest on top */}
            {messages.map((msg, index) => (
                <p key={index}>{msg}</p>
            ))}
        </div>
    );
}

function SecaoContatos() {
    return (
        <div id={styles.portal_usuario_direita}>
            <div className={styles.secao_contatos}>
                <div className={styles.topo_secao_contatos}><h2>Usuários Conectados - 0</h2></div>
            </div>
            <div className={styles.secao_contatos}>
                <div className={styles.topo_secao_contatos}><h2>Usuários Desconectados - 0</h2></div>
            </div>
        </div>
    );
}