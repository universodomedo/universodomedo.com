'use client';

import { useEffect, useState } from 'react';
import { useSocketEvent } from 'Hooks/useSocketEvent';
import { emitSocketEvent } from 'Libs/emitSocketEvent';
import { SOCKET_EVENTOS, SalaChatFront, MensagemChatRecebida, MensagemChatPayload } from 'types-nora-api';

export default function TesteChatPage() {
    const [salas, setSalas] = useState<SalaChatFront[]>([]);

    useSocketEvent<SalaChatFront[]>(
        SOCKET_EVENTOS.Chat.receberSalasDisponiveis,
        (salasRecebidas) => {
            setSalas(salasRecebidas);
        }
    );

    useSocketEvent<MensagemChatRecebida>(
        SOCKET_EVENTOS.Chat.receberMensagem,
        (novaMensagem) => {
            setSalas((salasAnteriores) =>
                salasAnteriores.map((sala) =>
                    sala.id === novaMensagem.salaId
                        ? {
                            ...sala,
                            mensagensIniciais: [...sala.mensagensIniciais, novaMensagem],
                        }
                        : sala
                )
            );
        }
    );

    useEffect(() => {
        emitSocketEvent(SOCKET_EVENTOS.Chat.receberSalasDisponiveis);
    }, []);

    const enviarMensagem = (salaId: string, conteudo: string) => {
        const payload: MensagemChatPayload = { salaId, conteudo };
        emitSocketEvent(SOCKET_EVENTOS.Chat.enviarMensagem, payload);
    };

    return (
        <div style={{ width: '100%', height: '100%', padding: '2%', display: `flex`, flexDirection: `row`, justifyContent: `space-around`, gap: `3vw` }}>
            {salas.map((sala) => (
                <div key={sala.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', gap: '.7vh', padding: 10, border: '1px solid gray', textAlign: 'center' }}>
                    <h2>Sala: {sala.id}</h2>
                    <hr />

                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '2vh' }}>
                        <div style={{ flex: '1 0 0', display: 'flex', flexDirection: 'column', textAlign: 'start', overflow: 'auto' }}>
                            {sala.mensagensIniciais.map((msg, idx) => (
                                <div key={idx}>
                                    <strong>{msg.idUsuario}:</strong> {msg.conteudo}
                                </div>
                            ))}
                        </div>

                        {sala.podeEscrever && (
                            <div style={{ flex: '0 0 0', width: '100%' }}>
                                <input style={{ width: '100%' }} type="text" placeholder="Digite sua mensagem..." onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const input = e.target as HTMLInputElement;
                                        if (!input.value.trim()) return;
                                        enviarMensagem(sala.id, input.value.trim());
                                        input.value = '';
                                    }
                                }} />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}