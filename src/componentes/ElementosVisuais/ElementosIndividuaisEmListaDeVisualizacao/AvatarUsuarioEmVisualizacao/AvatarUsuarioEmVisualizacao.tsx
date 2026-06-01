'use client';

import styles from './styles.module.css';

import { UsuarioCompletaDto } from "types-nora-api";
import cn from 'classnames'

import { useUsuarioAvatar } from "Redux/hooks/useUsuarioAvatar";
import { RenderUsuario } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

export function AvatarUsuarioEmVisualizacao({ usuario }: { usuario: UsuarioCompletaDto } ) { return <RenderUsuario caminhoArquivoAvatar={usuario.customizacao.caminhoArquivoAvatar} />; };

export function AvatarUsuarioEmVisualizacao_CACHED({ idUsuario, avatarUsuarioMini }: { idUsuario: number; avatarUsuarioMini?: true; } ) {
    const CACHED_pathAvatarUsuario = useUsuarioAvatar(idUsuario);

    return <RenderUsuario caminhoArquivoAvatar={CACHED_pathAvatarUsuario} className={cn(avatarUsuarioMini && styles.avatar_usuario)} />;
};