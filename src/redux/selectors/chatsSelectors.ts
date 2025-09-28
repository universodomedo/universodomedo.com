import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store/types';
import { MensagemChatRecebida } from 'types-nora-api';

export const selectSalas = (state: RootState) => state.chats.salas;
export const selectSalaSelecionadaId = (state: RootState) => state.chats.salaSelecionadaId;

export const selectSalaSelecionada = createSelector(
    [selectSalas, selectSalaSelecionadaId],
    (salas, salaId) => salas.find((s) => s.id === salaId) || null
);

export const selectSalaSelecionadaComGrupos = createSelector(
    [selectSalaSelecionada],
    (sala) => {
        if (!sala) return null;

        const resultado: MensagemChatRecebida[][] = [];
        let grupoAtual: MensagemChatRecebida[] = [];

        for (let i = 0; i < sala.mensagensIniciais.length; i++) {
            const msg = sala.mensagensIniciais[i];
            const anterior = sala.mensagensIniciais[i - 1];

            if (!anterior || anterior.idUsuario !== msg.idUsuario) {
                if (grupoAtual.length > 0) resultado.push(grupoAtual);
                grupoAtual = [msg];
            } else {
                grupoAtual.push(msg);
            }
        }
        if (grupoAtual.length > 0) resultado.push(grupoAtual);

        return { ...sala, grupos: resultado };
    }
);