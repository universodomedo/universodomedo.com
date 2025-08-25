'use client';

import styles from './styles.module.css';

import { useAppDispatch, useAppSelector } from 'Redux/hooks/useRedux';
import { selectSalas, selectSalaSelecionadaComGrupos, selectSalaSelecionadaId } from 'redux/selectors/chatsSelectors';
import { selecionarSala } from 'redux/slices/chatsSlice';
import emitSocketEvent from 'Libs/emitSocketEvent';
import { SOCKET_EVENTOS, MensagemChatPayload } from 'types-nora-api';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { RootState } from 'redux/store/types';

export default function Chat() {
    const dispatch = useAppDispatch();
    const salas = useAppSelector(selectSalas);
    const salaSelecionada = useAppSelector(selectSalaSelecionadaComGrupos);
    const salaSelecionadaId = useAppSelector(selectSalaSelecionadaId);

    const usuarios = useAppSelector((state: RootState) => state.usuarios.usuarios);

    if (!usuarios || usuarios.length === 0) {
        return null;
    }

    const getUsuarioPorId = (id: number) => usuarios.find((u) => u.id === id)!;

    const enviarMensagem = (conteudo: string) => {
        if (!salaSelecionadaId || !conteudo.trim()) return;
        const payload: MensagemChatPayload = { salaId: salaSelecionadaId, conteudo };
        emitSocketEvent(SOCKET_EVENTOS.Chat.enviarMensagem, payload);
    };

    return (
        <div id={styles.recipiente_chat}>
            <div id={styles.recipiente_corpo_chat}>

                {/* CONTEÚDO DA SALA SELECIONADA */}
                <div id={styles.recipiente_conteudo_conversa}>
                    <div id={styles.recipiente_mensagens_conversa}>
                        {salaSelecionada ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
                                {salaSelecionada.grupos.map((grupo, idx) => {
                                    const usuario = getUsuarioPorId(grupo[0].idUsuario);

                                    return (
                                        <div key={idx} style={{ display: 'flex', flexDirection: 'row', gap: '.8vw' }}>
                                            <div style={{ width: '10%' }}>
                                                <div style={{ position: 'relative', width: '100%', aspectRatio: '1' }}>
                                                    <RecipienteImagem src={usuario.avatar} />
                                                </div>
                                            </div>
                                            <div className="grupoDeMensagens" style={{ display: 'flex', flexDirection: 'column', width: '90%', gap: '.4vh' }}>
                                                {grupo.map((msg, midx) => (
                                                    <div key={midx} style={{
                                                        flex: '1 0 0',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'space-between',
                                                        backgroundColor: '#35133E',
                                                        padding: '.6vh .4vw',
                                                        gap: '.6rem',
                                                        borderRadius: '7px',
                                                        boxShadow: '#201433 0px 1px 9px 2px'
                                                    }}>
                                                        {midx === 0 && (
                                                            <p>{usuario.username}</p>
                                                        )}
                                                        <p>{msg.conteudo}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>Nenhuma sala selecionada.</p>
                        )}
                    </div>

                    {/* INPUT PARA ENVIAR MENSAGEM */}
                    {salaSelecionada && salaSelecionada.podeEscrever && (
                        <div id={styles.recipiente_input_conversa}>
                            <input
                                id={'input_texto_chat'}
                                placeholder={'Enviar mensagem..'}
                                autoComplete={'off'}
                                onKeyDown={(e) => {
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
                </div>

                {/* LISTA DE SALAS */}
                <div id={styles.recipiente_salas}>
                    <div id={styles.recipiente_lista_salas}>
                        {salas.map((sala) => (
                            <div
                                key={sala.id}
                                style={{
                                    padding: '8px',
                                    marginBottom: '6px',
                                    border: sala.id === salaSelecionadaId ? '2px solid #8e44ad' : '1px solid gray',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    background: sala.id === salaSelecionadaId ? '#3b1f47' : 'transparent'
                                }}
                                onClick={() => dispatch(selecionarSala(sala.id))}
                            >
                                <h4>{sala.id}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}