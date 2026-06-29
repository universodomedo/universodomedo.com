'use client';

import styles from './styles.module.css';

import { type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';

import { Renderiza__ImagemUDM__ArteCapaEnquadrada } from 'Uteis/RenderImagemUDM/Renderiza__ImagemUDM__ArteCapaEnquadrada';
import type { EncaixeArteCapaPartida } from 'types-nora-api';

interface Props {
    nome: string;
    imagemBase64?: string | null;
    encaixe?: EncaixeArteCapaPartida | null;
    selecionado?: boolean;
    className?: string;
    style?: CSSProperties;
    onClick?: () => void;
    onPointerDown?: (evento: ReactPointerEvent<HTMLButtonElement>) => void;
    onPointerMove?: (evento: ReactPointerEvent<HTMLButtonElement>) => void;
    onPointerUp?: (evento: ReactPointerEvent<HTMLButtonElement>) => void;
    onPointerCancel?: (evento: ReactPointerEvent<HTMLButtonElement>) => void;
};

// Visual reutilizável do item de Partida no Orbital: capa (base-only + encaixe) ao fundo + nome + estado selecionado.
// Posição/tamanho/fonte vêm do caller (Orbital: .item_orbital + estilo px; preview da config: classe com cqw). Usado no Orbital e no preview de configuração da Arte de Capa.
export function ItemPartidaOrbital({ nome, imagemBase64, encaixe, selecionado, className, style, onClick, onPointerDown, onPointerMove, onPointerUp, onPointerCancel }: Props) {
    return (
        <button type="button" className={`${styles.cartao} ${selecionado ? styles.cartao_selecionado : ''} ${className ?? ''}`} style={style} onClick={onClick} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerCancel}>
            {imagemBase64 && <Renderiza__ImagemUDM__ArteCapaEnquadrada className={styles.capa} imagemBase64={imagemBase64} encaixe={encaixe} />}
            {imagemBase64 && <span className={styles.escurecimento} />}
            <strong className={styles.nome}>{nome}</strong>
        </button>
    );
};
