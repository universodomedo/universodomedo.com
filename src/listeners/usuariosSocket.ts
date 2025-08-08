import { useEffect } from 'react';

import { useAppDispatch } from 'Redux/hooks/useRedux';
import useSocketEvent from 'Hooks/useSocketEvent'
import emitSocketEvent from 'Libs/emitSocketEvent';
import { setUsuarios } from 'Redux/slices/usuariosSlice';
import { SOCKET_EVENTOS, SOCKET_UsuarioExistente } from 'types-nora-api';

export function useUsuariosSocket() {
    const dispatch = useAppDispatch();

    useSocketEvent<SOCKET_UsuarioExistente[]>(
        SOCKET_EVENTOS.UsuariosExistentes.obterTodos,
        (usuarios) => {
            dispatch(setUsuarios(usuarios));
        }
    );

    useEffect(() => {
        emitSocketEvent(SOCKET_EVENTOS.UsuariosExistentes.obterTodos);
    }, []);
}