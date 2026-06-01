'use client';

import styles from './styles.module.css';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
    const recipienteRef = useRef<HTMLDivElement>(null);
    const [bolhaPos, setBolhaPos] = useState<{ top: number; right: number; size: number } | null>(null);

    useEffect(() => {
        if (!caminhoAtual || caminhoAtual === exibido) return;
        if (!exibido) { setExibido(caminhoAtual); return; }
        setFase('saindo');
        const tTroca = setTimeout(() => { setExibido(caminhoAtual); setFase('entrando'); setMostrarBolha(true); }, 150);
        const tNormal = setTimeout(() => setFase('normal'), 400);
        // const tBolha = setTimeout(() => setMostrarBolha(false), 350);
        return () => { clearTimeout(tTroca); clearTimeout(tNormal);  };
    }, [caminhoAtual]);

    useEffect(() => {
        if (!mostrarBolha || !recipienteRef.current) { setBolhaPos(null); return; }
        const rect = recipienteRef.current.getBoundingClientRect();
        const size = rect.width * 0.17;
        setBolhaPos({ top: rect.top + rect.height * 0.05, right: (window.innerWidth - rect.right) + rect.width * 0.05, size });
    }, [mostrarBolha]);

    return (
        <div ref={recipienteRef} className={styles.recipiente_avatar_animado}>
            <RenderUsuario caminhoArquivoAvatar={exibido} className={cn(avatarUsuarioMini && styles.avatar_usuario, fase === 'saindo' && styles.avatar_saindo, fase === 'entrando' && styles.avatar_entrando)} />
            {mostrarBolha && bolhaPos && createPortal(
                <div className={styles.bolha_notificacao} style={{ position: 'fixed', top: bolhaPos.top, right: bolhaPos.right, width: bolhaPos.size, fontSize: bolhaPos.size * 0.55 }}>!</div>,
                document.body
            )}
        </div>
    );
};