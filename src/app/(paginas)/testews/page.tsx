"use client";

import { Eventos_Envia, Eventos_Emite } from 'types-nora-api';

import { useEffect, useState } from "react";
import "./page.css";
import { useEventoWs } from "Hooks/useEventoWs";

export default function Page() {
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<string[]>([
        'string1',
        'string2',
        'string3'
    ]);

    useEventoWs(Eventos_Emite.Teste.eventos.enviaPraQuemPediu, (data) => {
        setMessages(prev => [...prev, data.msg]);
    });

    const handleMudarTexto = () => {
        console.log(`teste`);

        useEventoWs(Eventos_Envia.Teste.eventos.mudaTexto, {
            novoTexto: "AAAc",
        });
    };

    return (
        <div className="ws-container">
            <h1 className="ws-title">oi</h1>

            <div className="ws-input-container">
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Digite sua mensagem..." className="ws-input" />
            </div>

            <div className="ws-buttons-container">
                <button onClick={handleMudarTexto} className="ws-btn ws-btn-primary">
                    mudar texto
                </button>
            </div>

            <div className="ws-messages-container">
                <h2 className="ws-messages-title">Mensagens:</h2>
                <div className="ws-messages-list">
                    {messages.map((message, index) => (
                        <div key={index} className="ws-message-item">
                            {message}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};