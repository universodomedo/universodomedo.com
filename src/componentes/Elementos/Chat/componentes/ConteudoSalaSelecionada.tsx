'use client';

import styles from '../styles.module.css';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Eventos_EnviaERecebe, TAMANHO_MAXIMO_MENSAGEM_CHAT, type WsErrorResponse } from 'types-nora-api';

import { useAppDispatch, useAppSelector } from 'Redux/hooks/useRedux';
import { RootState } from 'Redux/store/types';
import { selectSalaSelecionadaComGrupos, selectSalaSelecionadaId } from 'Redux/selectors/chatsSelectors';
import { mensagensAntigasCarregadas } from 'Redux/slices/chatsSlice';

import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import AgrupamentoMensagensChat from '../subcomponentes/AgrupamentoMensagensChat';
import useLimitaUso from 'Hooks/useLimitaUso';
import { eventoWs } from "Hooks/useEventoWs";

export default function ConteudoSalaSelecionada() {
    const dispatch = useAppDispatch();
    const salaSelecionada = useAppSelector(selectSalaSelecionadaComGrupos);
    const salaSelecionadaId = useAppSelector(selectSalaSelecionadaId);
    const usuarios = useAppSelector((state: RootState) => state.usuarios.usuarios);
    const possuiMaisAntigas = useAppSelector((state: RootState) => salaSelecionadaId ? state.chats.possuiMaisAntigas[salaSelecionadaId] ?? false : false);
    const [carregandoAntigas, setCarregandoAntigas] = useState(false);

    const [mensagem, setMensagem] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [erroEnvio, setErroEnvio] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mensagensConteinerRef = useRef<HTMLDivElement>(null);
    // Retry do MESMO conteúdo reutiliza a chave de envio => o backend reconhece e não duplica.
    const chaveEnvioRef = useRef<{ conteudo: string; chave: string } | null>(null);

    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });
    const { ref: scrollableRef, ...scrollablePropsSemRef } = scrollableProps as unknown as { ref?: React.Ref<HTMLDivElement> } & React.HTMLAttributes<HTMLDivElement>;
    const setMensagensRef = useCallback((el: HTMLDivElement | null) => {
        mensagensConteinerRef.current = el;

        if (!scrollableRef) return;

        if (typeof scrollableRef === 'function') scrollableRef(el);
        else (scrollableRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    }, [scrollableRef]);

    const getUsuarioPorId = (id: number) => usuarios.find((u) => u.id === id)!;

    const { podeUsar, registrarUso, isBlocked, remainingTime } = useLimitaUso({
        limit: 5,
        timeWindow: 60,
        storageKey: salaSelecionadaId ? `chat-rate-limit-${salaSelecionadaId}` : undefined,
    });

    const scrollParaBaixo = useCallback(() => {
        const container = mensagensConteinerRef.current;

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

        const chave = (chaveEnvioRef.current && chaveEnvioRef.current.conteudo === conteudo) ? chaveEnvioRef.current.chave : crypto.randomUUID();
        chaveEnvioRef.current = { conteudo, chave };

        setEnviando(true);
        setErroEnvio(null);

        eventoWs(Eventos_EnviaERecebe.Chat.eventos.enviaMensagem, { salaId: salaSelecionadaId, conteudoMensagem: conteudo, chaveEnvio: chave }, {
            onSuccess: () => {
                setEnviando(false);
                chaveEnvioRef.current = null;
                registrarUso();
                scrollParaBaixo();

                // Limpa o input só após o ack: sem render otimista, a mensagem chega pela emissão da sala
                setMensagem('');
            },
            onError: (err: WsErrorResponse) => {
                setEnviando(false);
                setErroEnvio(err.mensagem);
            },
        });
    }, [salaSelecionadaId, podeUsar, registrarUso, scrollParaBaixo]);

    const carregarMensagensAnteriores = useCallback(() => {
        if (!salaSelecionadaId || !salaSelecionada || carregandoAntigas) return;

        const primeiraMensagem = salaSelecionada.mensagensIniciais[0];
        if (!primeiraMensagem) return;

        setCarregandoAntigas(true);

        // Preserva a posição de leitura: após o prepend, compensa o scroll pela altura adicionada
        const container = mensagensConteinerRef.current;
        const alturaAntes = container?.scrollHeight ?? 0;
        const topoAntes = container?.scrollTop ?? 0;

        eventoWs(Eventos_EnviaERecebe.Chat.eventos.buscarMensagensAnteriores, { salaId: salaSelecionadaId, antesDeId: primeiraMensagem.id }, {
            onSuccess: (data) => {
                dispatch(mensagensAntigasCarregadas({ salaId: salaSelecionadaId, mensagens: data.mensagens, possuiMais: data.possuiMais }));
                setCarregandoAntigas(false);

                requestAnimationFrame(() => {
                    const c = mensagensConteinerRef.current;
                    if (c) c.scrollTop = topoAntes + (c.scrollHeight - alturaAntes);
                });
            },
            onError: (err: WsErrorResponse) => {
                setCarregandoAntigas(false);
                setErroEnvio(err.mensagem);
            },
        });
    }, [salaSelecionadaId, salaSelecionada, carregandoAntigas, dispatch]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleEnviarMensagem();
        }
    }, [mensagem]);

    const handleEnviarMensagem = useCallback(() => {
        if (!mensagem.trim() || enviando) return;
        enviarMensagem(mensagem.trim());
    }, [mensagem, enviando, enviarMensagem]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setMensagem(e.target.value);
        setErroEnvio(null);
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
                    <div id={styles.recipiente_mensagens_conversa} {...scrollablePropsSemRef} ref={setMensagensRef}>
                        {possuiMaisAntigas && (
                            <button id={styles.botao_carregar_anteriores} onClick={carregarMensagensAnteriores} disabled={carregandoAntigas}>{carregandoAntigas ? 'Carregando..' : 'Carregar mensagens anteriores'}</button>
                        )}
                        {salaSelecionada.grupos.map((grupo, indexAgrupamentoMensagens) => <AgrupamentoMensagensChat key={indexAgrupamentoMensagens} usuario={getUsuarioPorId(grupo[0].idUsuario)} grupo={grupo} />)}
                    </div>

                    {salaSelecionada && salaSelecionada.estado === 'TRANCADA' && (
                        <p id={styles.aviso_sala_trancada}>Sala trancada — somente leitura.</p>
                    )}

                    {salaSelecionada && salaSelecionada.podeEscrever && (
                        <>
                            <div id={styles.recipiente_input_conversa}>
                                <input ref={inputRef} id={'input_texto_chat'} placeholder={isBlocked ? `Aguarde ${remainingTime}s...` : 'Enviar mensagem..'} autoComplete={'off'} value={mensagem} onChange={handleInputChange} onKeyDown={handleKeyDown} disabled={isBlocked} maxLength={TAMANHO_MAXIMO_MENSAGEM_CHAT} />
                                <button onClick={handleEnviarMensagem} disabled={!mensagem.trim() || isBlocked || enviando}>{enviando ? 'Enviando..' : 'Enviar'}</button>
                            </div>
                            {erroEnvio && <p id={styles.mensagem_erro_envio}>{erroEnvio}</p>}
                        </>
                    )}
                </>
            )}
        </div>
    );
};