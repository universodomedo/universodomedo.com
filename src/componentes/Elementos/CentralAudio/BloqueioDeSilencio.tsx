'use client';

import { useEffect } from 'react';

import { useAppDispatch } from 'Redux/hooks/useRedux';
import { setSilencioBloqueado } from 'Redux/slices/audioPaginaSlice';

// Componente null — sem UI própria. Enquanto a página que o renderiza estiver montada, o mute (Silencioso) fica bloqueado na Central e o volume trava no Mínimo.
// Usado nas páginas em que o áudio é ferramenta, não opcional (Partidas, EmJogo). Ao desmontar (sair da página), o mudo do usuário volta sozinho (nível efetivo).
export function BloqueioDeSilencio() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setSilencioBloqueado(true));
        return () => { dispatch(setSilencioBloqueado(false)); };
    }, [dispatch]);

    return null;
};
