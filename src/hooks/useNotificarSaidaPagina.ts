import { useEffect } from 'react';

import { emitSocketEvent } from 'Libs/emitSocketEvent';
import { SOCKET_EVENTOS } from 'types-nora-api';

export default function useNotificarFechamento(usuarioEstaLogado: boolean) {
    useEffect(() => {
        if (!usuarioEstaLogado) return;

        const handleUnload = () => {
            console.log(`handleUnload`);
            emitSocketEvent(SOCKET_EVENTOS.AcessosUsuarios.desconectarUsuario);
        };

        console.log(`addEventListener beforeunload`);
        window.addEventListener('beforeunload', handleUnload);

        return () => {
            console.log(`removeEventListener beforeunload`);
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [usuarioEstaLogado]);
}