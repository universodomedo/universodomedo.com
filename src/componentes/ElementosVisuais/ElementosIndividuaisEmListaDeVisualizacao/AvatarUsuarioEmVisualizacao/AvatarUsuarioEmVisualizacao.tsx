'use client';

import styles from './styles.module.css';

import { UsuarioCompletaDto } from "types-nora-api";
import cn from 'classnames'

import { useUsuarioAvatar } from "Redux/hooks/useUsuarioAvatar";
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export function AvatarUsuarioEmVisualizacao({ usuario }: { usuario: UsuarioCompletaDto } ) {
    return <RecipienteImagem src={usuario.customizacao.caminhoAvatar} />;
};

export function AvatarUsuarioEmVisualizacao_CACHED({ idUsuario, avatarUsuarioMini }: { idUsuario: number; avatarUsuarioMini?: true; } ) {
    const CACHED_pathAvatarUsuario = useUsuarioAvatar(idUsuario);

    return <RecipienteImagem src={CACHED_pathAvatarUsuario} className={cn(avatarUsuarioMini && styles.avatar_usuario)} />;
};