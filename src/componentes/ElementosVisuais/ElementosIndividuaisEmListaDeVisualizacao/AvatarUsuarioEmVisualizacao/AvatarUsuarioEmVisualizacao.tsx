'use client';

import { useUsuarioAvatar } from "Redux/hooks/useUsuarioAvatar";
import { UsuarioDto } from "types-nora-api";

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

export function AvatarUsuarioEmVisualizacao({ usuario }: { usuario: UsuarioDto } ) {
    return <RecipienteImagem src={usuario.customizacao.caminhoAvatar} />;
};

export function AvatarUsuarioEmVisualizacao_CACHED({ idUsuario }: { idUsuario: number } ) {
    const CACHED_pathAvatarUsuario = useUsuarioAvatar(idUsuario);

    return <RecipienteImagem src={CACHED_pathAvatarUsuario} />;
};