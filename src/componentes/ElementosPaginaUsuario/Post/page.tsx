'use client';

import styles from './styles.module.css';
import { useState } from 'react';

import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import useSocketEvent from 'Hooks/useSocketEvent';
import { SOCKET_EVENTOS } from 'types-nora-api';
import emitSocketEvent from 'Libs/emitSocketEvent';

export default function SecaoPosts() {
    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');

    useSocketEvent<string>(SOCKET_EVENTOS.Chat.receberMensagem, (mensagem) => {
        setMessages((prev) => [mensagem, ...prev]);
    });

    const sendMessage = () => {
        console.log(`sendMessage`);
        console.log(newMessage);
        if (newMessage.trim()) {
            emitSocketEvent(SOCKET_EVENTOS.Chat.enviarMensagem, newMessage);
            setNewMessage('');
        }
    };

    const enviaTesteAcao = () => {
        // emitSocketEvent(SOCKET_EVENTOS.Chat.enviaTeste);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            sendMessage();
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
                <button onClick={enviaTesteAcao} className={styles.sendButton}>Realizar Teste</button>
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