'use client';

import styles from './styles.module.css';

import { useEffect, useState } from 'react';
import { UsuarioCompletaDto } from "types-nora-api";
import cn from 'classnames';

import { useUsuarioAvatar } from "Redux/hooks/useUsuarioAvatar";
import { RenderUsuario } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

export function AvatarUsuarioEmVisualizacao({ usuario }: { usuario: UsuarioCompletaDto }) { return <RenderUsuario caminhoArquivoAvatar={usuario.customizacao.caminhoArquivoAvatar} />; };

export function AvatarUsuarioEmVisualizacao_CACHED({ idUsuario, avatarUsuarioMini }: { idUsuario: number; avatarUsuarioMini?: true; }) {
    const caminhoAtual = useUsuarioAvatar(idUsuario);
    const [exibido, setExibido] = useState(caminhoAtual);
    const [visivel, setVisivel] = useState(true);

    useEffect(() => {
        if (!caminhoAtual || caminhoAtual === exibido) return;
        if (!exibido) { setExibido(caminhoAtual); return; }
        setVisivel(false);
        const t = setTimeout(() => { setExibido(caminhoAtual); setVisivel(true); }, 150);
        return () => clearTimeout(t);
    }, [caminhoAtual]);

    return <RenderUsuario caminhoArquivoAvatar={exibido} className={cn(styles.avatar_transicao, avatarUsuarioMini && styles.avatar_usuario, !visivel && styles.avatar_oculto)} />;
};