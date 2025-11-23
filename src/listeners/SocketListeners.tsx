'use client';

import { useEffect, useState } from 'react';

import InicializadorSocket from 'Componentes/Elementos/InicializadorSocket/InicializadorSocket';
import { useUsuariosSocket } from 'listeners/usuariosSocket';
import { useChatSocketListeners } from 'listeners/chatsSocket';

export default function SocketListeners() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return <SocketHooks />;
};

function SocketHooks() {
    InicializadorSocket();
    useUsuariosSocket(); // essa linha é responsável por obter todos os usuarios, q é utilizado como referencia dos avatares no chat
    useChatSocketListeners(); // socket para carregar salas e conteudo
    return null;
};