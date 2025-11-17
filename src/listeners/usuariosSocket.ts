'use client';

import { useEffect } from 'react';

import { Eventos_Recebe } from 'types-nora-api';

import { useAppDispatch } from 'Redux/hooks/useRedux';
import { setUsuarios } from 'Redux/slices/usuariosSlice';
import { useEventoWs } from 'Hooks/useEventoWs';

// const { eventoWs } = useEventoWs();

export function useUsuariosSocket() {
    const dispatch = useAppDispatch();

    // eventoWs(Eventos_Recebe.UsuariosConectados.eventos.obtemUsuariosConectados, (usuarios) => {
    //     console.log(`teste`);
    // });

    // useSocketEvent<SOCKET_UsuarioExistente[]>(
    //     SOCKET_EVENTOS.UsuariosExistentes.obterTodos,
    //     (usuarios) => {
    //         dispatch(setUsuarios(usuarios));
    //     }
    // );

    // useEffect(() => {
    //     emitSocketEvent(SOCKET_EVENTOS.UsuariosExistentes.obterTodos);
    // }, []);
};