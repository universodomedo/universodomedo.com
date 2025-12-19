'use client';

import { Eventos_EnviaERecebe } from 'types-nora-api';

import { useAppDispatch } from 'Redux/hooks/useRedux';
import { setUsuarios } from 'Redux/slices/usuariosSlice';
import { eventoWs } from "Hooks/useEventoWs";

export function useUsuariosSocket() {
    const dispatch = useAppDispatch();

    eventoWs(Eventos_EnviaERecebe.UsuariosExistentes.eventos.obterTodos, {}, data => {
        console.log(`teste`);
        console.log(data);
        dispatch(setUsuarios(data.usuariosExistentes));
    });
};