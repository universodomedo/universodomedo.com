'use client';

import { Eventos_Emite, Eventos_EnviaERecebe } from 'types-nora-api';

import { useAppDispatch } from 'Redux/hooks/useRedux';
import { atualizarAvatarUsuario, setUsuarios } from 'Redux/slices/usuariosSlice';
import { eventoWs, useRecebeEmitWs } from "Hooks/useEventoWs";

export function useUsuariosSocket() {
    const dispatch = useAppDispatch();

    eventoWs(Eventos_EnviaERecebe.UsuariosExistentes.eventos.obterTodos, {}, data => {
        dispatch(setUsuarios(data.usuariosExistentes));
    });

    useRecebeEmitWs(Eventos_Emite.UsuariosExistentes.eventos.emitirAvatarPerfilAtualizado, data => {
        dispatch(atualizarAvatarUsuario({ id: data.id, caminhoArquivoAvatar: data.caminhoArquivoAvatar }));
    });
};