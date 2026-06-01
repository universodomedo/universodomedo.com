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
    const [fase, setFase] = useState<'normal' | 'saindo' | 'entrando'>('normal');
    const [mostrarBolha, setMostrarBolha] = useState(false);

    useEffect(() => {
        if (!caminhoAtual || caminhoAtual === exibido) return;
        if (!exibido) { setExibido(caminhoAtual); return; }
        setFase('saindo');
        const tTroca = setTimeout(() => { setExibido(caminhoAtual); setFase('entrando'); setMostrarBolha(true); }, 150);
        const tNormal = setTimeout(() => setFase('normal'), 400);
        const tBolha = setTimeout(() => setMostrarBolha(false), 3350);
        return () => { clearTimeout(tTroca); clearTimeout(tNormal); clearTimeout(tBolha); };
    }, [caminhoAtual]);

    return (
        <div className={styles.recipiente_avatar_animado}>
            <RenderUsuario
                caminhoArquivoAvatar={exibido}
                className={cn(
                    avatarUsuarioMini && styles.avatar_usuario,
                    fase === 'saindo' && styles.avatar_saindo,
                    fase === 'entrando' && styles.avatar_entrando,
                )}
            />
            {mostrarBolha && <div className={styles.bolha_notificacao}>!</div>}
        </div>
    );
};