'use client';

import { useEffect, useState } from 'react';

import useInicializarSocket from 'Hooks/useInicializarSocket';
import { useUsuariosSocket } from 'listeners/usuariosSocket';

function SocketHooks() {
    useInicializarSocket(true);
    useUsuariosSocket();
    return null;
}

export default function SocketListeners() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return <SocketHooks />;
}