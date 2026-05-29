'use client';

import cn from 'classnames';
import { type PalcoParticipanteDto } from 'types-nora-api';

import styles from './styles.module.css';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';

type CartaoParticipantePalcoProps = {
    participante: PalcoParticipanteDto;
    processando?: boolean;
    avatarUsuarioMini?: boolean;
    onDragStart?: (idUsuario: number) => void;
    onDragEnd?: () => void;
};

export default function CartaoParticipantePalco({ participante, processando = false, onDragStart, onDragEnd }: CartaoParticipantePalcoProps) {
    const arrastavel = !processando && !!onDragStart;

    return (
        <div draggable={arrastavel} onDragStart={() => { onDragStart?.(participante.idUsuario); }} onDragEnd={onDragEnd} className={cn(styles.card, arrastavel && styles.card_arrastavel, processando && styles.card_processando)}>
            <div className={styles.card_avatar}>
                <AvatarUsuarioEmVisualizacao_CACHED idUsuario={participante.idUsuario} />
            </div>
            <p className={styles.card_nome}>{participante.nome}</p>
        </div>
    );
};