// src/redux/slices/chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SalaChatFront, MensagemChatRecebida } from 'types-nora-api';

interface ChatState {
    salas: SalaChatFront[];
    salaSelecionadaId: string | null;
}

const initialState: ChatState = {
    salas: [],
    salaSelecionadaId: null,
};

const chatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setSalas(state, action: PayloadAction<SalaChatFront[]>) {
            state.salas = action.payload;
            // se não houver sala selecionada, seleciona a primeira disponível
            if (!state.salaSelecionadaId && action.payload.length > 0) {
                state.salaSelecionadaId = action.payload[0].id;
            }
        },
        adicionarMensagem(state, action: PayloadAction<MensagemChatRecebida>) {
            const msg = action.payload;
            const sala = state.salas.find((s) => s.id === msg.salaId);
            if (sala) {
                sala.mensagensIniciais.push(msg);
            }
        },
        selecionarSala(state, action: PayloadAction<string>) {
            state.salaSelecionadaId = action.payload;
        },
    },
});

export const { setSalas, adicionarMensagem, selecionarSala } = chatsSlice.actions;
export default chatsSlice.reducer;
