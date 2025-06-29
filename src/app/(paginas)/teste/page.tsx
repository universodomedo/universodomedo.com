'use client';

import { useState } from 'react';
import { useSocketEvent } from 'Hooks/useSocketEvent';
import { emitSocketEvent } from 'Libs/emitSocketEvent';

export default function TesteSocket() {
    const [recipienteDoTeste, setRecipienteDoTeste] = useState('antes do teste');

    // Escuta evento vindo do servidor
    useSocketEvent<string>('teste-mensagem', (mensagem) => {
        console.log('📨 Mensagem recebida via socket:', mensagem);
        setRecipienteDoTeste(mensagem);
    });

    // Emite sob demanda (usando a função centralizada)
    const emitirManual = () => {
        console.log('🚀 Emitindo disparar-teste');
        emitSocketEvent('disparar-teste', 'Mensagem do botão!');
    };

    return (
        <>
            <h1>Olha o teste ai</h1>
            <h2>{recipienteDoTeste}</h2>
            <button onClick={emitirManual}>Disparar evento manual</button>
        </>
    );
}
