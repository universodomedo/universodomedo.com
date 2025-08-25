'use client';

import styles from '../styles.module.css';
import { SOCKET_EVENTOS, MensagemChatPayload } from 'types-nora-api';

import { RootState } from 'Redux/store/types';
import { useAppSelector } from 'Redux/hooks/useRedux';
import { selectSalaSelecionadaComGrupos, selectSalaSelecionadaId } from 'redux/selectors/chatsSelectors';
import emitSocketEvent from 'Libs/emitSocketEvent';
import AgrupamentoMensagensChat from '../subcomponentes/AgrupamentoMensagensChat';

export default function ConteudoSalaSelecionada() {
    const salaSelecionada = useAppSelector(selectSalaSelecionadaComGrupos);
    const salaSelecionadaId = useAppSelector(selectSalaSelecionadaId);

    const usuarios = useAppSelector((state: RootState) => state.usuarios.usuarios);

    const getUsuarioPorId = (id: number) => usuarios.find((u) => u.id === id)!;

    const enviarMensagem = (conteudo: string) => {
        if (!salaSelecionadaId || !conteudo.trim()) return;
        const payload: MensagemChatPayload = { salaId: salaSelecionadaId, conteudo };
        emitSocketEvent(SOCKET_EVENTOS.Chat.enviarMensagem, payload);
    };

    return (
        <div id={styles.recipiente_conteudo_conversa}>
            {!salaSelecionada ? (
                <p>Nenhuma sala selecionada.</p>
            ) : (
                <>
                    <div id={styles.recipiente_mensagens_conversa}>
                        {salaSelecionada.grupos.map((grupo, indexAgrupamentoMensagens) => <AgrupamentoMensagensChat key={indexAgrupamentoMensagens} usuario={getUsuarioPorId(grupo[0].idUsuario)} grupo={grupo} />)}
                    </div>

                    {salaSelecionada && salaSelecionada.podeEscrever && (
                        <div id={styles.recipiente_input_conversa}>
                            {/* separar esse metodo de mandar mensagem para fazer um botao junto do input e manter o keyDown do Enter */}
                            <input id={'input_texto_chat'} placeholder={'Enviar mensagem..'} autoComplete={'off'} onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const input = e.target as HTMLInputElement;
                                    if (!input.value.trim()) return;
                                    enviarMensagem(input.value.trim());
                                    input.value = '';
                                }
                            }}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};