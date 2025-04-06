'use client';

import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { getSocket } from 'Libs/socket.ts';

import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';

export default function SecaoPosts() {
    const [messages, setMessages] = useState<string[]>([]);  // Use an array to store messages
    const [newMessage, setNewMessage] = useState<string>('');  // State to store the new message input

    useEffect(() => {
        const socket = getSocket();

        socket.on('message', (data) => {
            console.log('Received:', data);
            setMessages((prevMessages) => [data, ...prevMessages]);  // Prepend new message to the array
        });

        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        const socket = getSocket();

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

    const { scrollableProps } = useScrollable();

    return (
        <div id={styles.recipiente_lista_posts} {...scrollableProps}>
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
                    maxLength={60}
                />
                <button onClick={sendMessage} className={styles.sendButton}>Send Message</button>
            </div>

            {/* Display all messages, with the newest on top */}
            <div id={styles.recipiente_mensagens}>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
        </div>
    );
};

// export default function SecaoPosts() {
//     return (
//         <div className={styles.recipiente_post}>
//             <div className={styles.post_parte_superior}>
//                 <div className={styles.recipiente_imagem_personagem}>
//                     <Image alt='' src={'/imagem-perfil-vazia.png'} fill />
//                 </div>
//                 <div className={styles.recipiente_imagem_personagem}>
//                     <Image alt='' src={'/imagem-perfil-vazia.png'} fill />
//                 </div>
//                 <div className={styles.recipiente_imagem_personagem}>
//                     <Image alt='' src={'/imagem-perfil-vazia.png'} fill />
//                 </div>
//                 <div className={styles.recipiente_imagem_personagem}>
//                     <Image alt='' src={'/imagem-perfil-vazia.png'} fill />
//                 </div>
//                 <h1>Apenas uma Prece: Aventura Finalizada!</h1>
//             </div>

//             <div className={styles.post_parte_inferior}>
//                 <div className={styles.recipiente_imagem_post}>
//                     <Image alt='' src={'/testeCapa1.png'} fill />
//                 </div>
//                 <div className={styles.recipiente_informacoes_parte_inferior}>
//                     <div className={styles.recipiente_informacoes_cabecalho}>
//                         <h1>A Sinfonia da Vida e da Morte, o Fim do Devoto, o nascimento da Ruína</h1>
//                     </div>
//                     <div className={styles.recipiente_informacoes_corpo}>
//                         <p>Acompanhe o fim dessa saga</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };