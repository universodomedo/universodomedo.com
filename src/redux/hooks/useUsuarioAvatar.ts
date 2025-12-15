import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { obtemAvatarDeUsuarioPorId } from '../selectors/usuariosSelectors';

export function useUsuarioAvatar(usuarioId: number) {
    const selector = useMemo(() => obtemAvatarDeUsuarioPorId(usuarioId), [usuarioId]);
    return useSelector(selector);
};