'use client';

import styles from '../styles.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SOCKET_EVENTOS, MensagemChatPayload } from 'types-nora-api';

import { RootState } from 'Redux/store/types';
import { useAppSelector } from 'Redux/hooks/useRedux';
import { selectSalaSelecionadaComGrupos, selectSalaSelecionadaId } from 'redux/selectors/chatsSelectors';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import emitSocketEvent from 'Libs/emitSocketEvent';
import AgrupamentoMensagensChat from '../subcomponentes/AgrupamentoMensagensChat';
import useLimitaUso from 'Hooks/useLimitaUso';

export default function ConteudoSalaSelecionada() {
    const salaSelecionada = useAppSelector(selectSalaSelecionadaComGrupos);
    const salaSelecionadaId = useAppSelector(selectSalaSelecionadaId);
    const usuarios = useAppSelector((state: RootState) => state.usuarios.usuarios);

    const [mensagem, setMensagem] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const mensagensContainerRef = useRef<HTMLDivElement>(null);

    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    const getUsuarioPorId = (id: number) => usuarios.find((u) => u.id === id)!;

    const { podeUsar, registrarUso, isBlocked, remainingTime } = useLimitaUso({
        limit: 5,
        timeWindow: 60,
        storageKey: salaSelecionadaId ? `chat-rate-limit-${salaSelecionadaId}` : undefined,
    });

    const scrollParaBaixo = useCallback(() => {
        const container = mensagensContainerRef.current;

        if (container) {
            setTimeout(() => {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }, []);

    const enviarMensagem = useCallback((conteudo: string) => {
        if (!salaSelecionadaId || !conteudo.trim()) return;

        if (!podeUsar()) return;

        const payload: MensagemChatPayload = { salaId: salaSelecionadaId, conteudo };
        emitSocketEvent(SOCKET_EVENTOS.Chat.enviarMensagem, payload);
        registrarUso();
        scrollParaBaixo();

        // Limpa o input após enviar
        setMensagem('');
    }, [salaSelecionadaId, podeUsar, registrarUso]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleEnviarMensagem();
        }
    }, [mensagem]);

    const handleEnviarMensagem = useCallback(() => {
        if (!mensagem.trim()) return;
        enviarMensagem(mensagem.trim());
    }, [mensagem, enviarMensagem]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setMensagem(e.target.value);
    }, []);
    
    useEffect(() => {
        scrollParaBaixo();
    }, [salaSelecionadaId]);

    return (
        <div id={styles.recipiente_conteudo_conversa}>
            {!salaSelecionada ? (
                <p>Nenhuma sala selecionada.</p>
            ) : (
                <>
                    <div id={styles.recipiente_mensagens_conversa} ref={mensagensContainerRef} {...scrollableProps}>
                        {salaSelecionada.grupos.map((grupo, indexAgrupamentoMensagens) => <AgrupamentoMensagensChat key={indexAgrupamentoMensagens} usuario={getUsuarioPorId(grupo[0].idUsuario)} grupo={grupo} />)}
                    </div>

                    {salaSelecionada && salaSelecionada.podeEscrever && (
                        <div id={styles.recipiente_input_conversa}>
                            <input ref={inputRef} id={'input_texto_chat'} placeholder={isBlocked ? `Aguarde ${remainingTime}s...` : 'Enviar mensagem..'} autoComplete={'off'} value={mensagem} onChange={handleInputChange} onKeyDown={handleKeyDown} disabled={isBlocked} maxLength={100} />
                            <button onClick={handleEnviarMensagem} disabled={!mensagem.trim() || isBlocked}>Enviar</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};