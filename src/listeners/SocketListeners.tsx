'use client';

import { useEffect, useState } from 'react';

import useInicializarSocket from 'Hooks/useInicializarSocket';
import { useUsuariosSocket } from 'listeners/usuariosSocket';
import { useChatSocketListeners } from 'listeners/chatsSocket';

function SocketHooks() {
    useInicializarSocket(true);
    useUsuariosSocket(); // essa linha é responsável por obter todos os usuarios, q é utilizado como referencia dos avatares no chat
    useChatSocketListeners(); // socket para carregar salas e conteudo
    return null;
};

export default function SocketListeners() {
    // const [mounted, setMounted] = useState(false);

    // useEffect(() => {
    //     setMounted(true);
    // }, []);

    // if (!mounted) return null;

    return <SocketHooks />;
};