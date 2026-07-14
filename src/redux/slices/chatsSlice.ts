import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SalaChatFront, MensagemChatRecebida, LIMITE_MENSAGENS_INICIAIS_CHAT } from 'types-nora-api';

interface ChatState {
    salas: SalaChatFront[];
    salaSelecionadaId: number | null;
    possuiMaisAntigas: Record<number, boolean>;
};

const initialState: ChatState = {
    salas: [],
    salaSelecionadaId: null,
    possuiMaisAntigas: {},
};

const chatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setSalas(state, action: PayloadAction<SalaChatFront[]>) {
            state.salas = action.payload;

            // Carga inicial menor que o limite = não existe histórico anterior a ela
            action.payload.forEach((sala) => { state.possuiMaisAntigas[sala.id] = sala.mensagensIniciais.length >= LIMITE_MENSAGENS_INICIAIS_CHAT; });
        },
        adicionarMensagem(state, action: PayloadAction<MensagemChatRecebida>) {
            const msg = action.payload;
            const sala = state.salas.find((s) => s.id === msg.salaId);
            if (!sala) return;

            // Dedupe por id: reconexão/reemissão não duplica mensagem já presente
            if (sala.mensagensIniciais.some((m) => m.id === msg.id)) return;

            sala.mensagensIniciais.push(msg);
        },
        mensagensAntigasCarregadas(state, action: PayloadAction<{ salaId: number; mensagens: MensagemChatRecebida[]; possuiMais: boolean }>) {
            const { salaId, mensagens, possuiMais } = action.payload;
            const sala = state.salas.find((s) => s.id === salaId);
            if (!sala) return;

            const idsPresentes = new Set(sala.mensagensIniciais.map((m) => m.id));
            const novas = mensagens.filter((m) => !idsPresentes.has(m.id));
            sala.mensagensIniciais.unshift(...novas);

            state.possuiMaisAntigas[salaId] = possuiMais;
        },
        // Push de salas (nascimento/trancamento ao vivo): MERGE preservando as mensagens locais — setSalas cru apagaria histórico paginado e mensagens recebidas além das iniciais.
        salasAtualizadasMerge(state, action: PayloadAction<SalaChatFront[]>) {
            const atuais = new Map(state.salas.map((sala) => [sala.id, sala]));

            state.salas = action.payload.map((salaNova) => {
                const existente = atuais.get(salaNova.id);
                if (!existente) {
                    state.possuiMaisAntigas[salaNova.id] = salaNova.mensagensIniciais.length >= LIMITE_MENSAGENS_INICIAIS_CHAT;
                    return salaNova;
                }
                return { ...salaNova, mensagensIniciais: existente.mensagensIniciais };
            });

            if (state.salaSelecionadaId !== null && !state.salas.some((s) => s.id === state.salaSelecionadaId)) state.salaSelecionadaId = null;
        },
        selecionarSala(state, action: PayloadAction<number>) {
            state.salaSelecionadaId = action.payload;
        },
    },
});

export const { setSalas, adicionarMensagem, mensagensAntigasCarregadas, salasAtualizadasMerge, selecionarSala } = chatsSlice.actions;
export default chatsSlice.reducer;