'use client';

import { useEffect, useMemo, useState } from 'react';
import useSocketEvent from 'Hooks/useSocketEvent';
import emitSocketEvent from 'Libs/emitSocketEvent';
import { SOCKET_EVENTOS, SalaChatFront, MensagemChatRecebida, MensagemChatPayload } from 'types-nora-api';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

import { useSelector } from 'react-redux';
import { RootState } from 'Redux/store/types';

export default function TesteChatPage() {
    const [salas, setSalas] = useState<SalaChatFront[]>([]);

    useSocketEvent<SalaChatFront[]>(
        SOCKET_EVENTOS.Chat.receberSalasDisponiveis,
        (salasRecebidas) => {
            setSalas(salasRecebidas);
        }
    );

    useSocketEvent<MensagemChatRecebida>(
        SOCKET_EVENTOS.Chat.receberMensagem,
        (novaMensagem) => {
            setSalas((salasAnteriores) =>
                salasAnteriores.map((sala) =>
                    sala.id === novaMensagem.salaId
                        ? {
                            ...sala,
                            mensagensIniciais: [...sala.mensagensIniciais, novaMensagem],
                        }
                        : sala
                )
            );
        }
    );

    useEffect(() => {
        emitSocketEvent(SOCKET_EVENTOS.Chat.receberSalasDisponiveis);
    }, []);

    const enviarMensagem = (salaId: string, conteudo: string) => {
        const payload: MensagemChatPayload = { salaId, conteudo };
        emitSocketEvent(SOCKET_EVENTOS.Chat.enviarMensagem, payload);
    };

    const usuarios = useSelector((state: RootState) => state.usuarios.usuarios);
    const getUsuarioPorId = (id: number) => usuarios.find((u) => u.id === id)!;

    const salasComGrupos = useMemo(() => {
        return salas.map(sala => {
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
        });
    }, [salas]);

    return (
        <div style={{ width: '100%', height: '100%', padding: '2%', display: `flex`, flexDirection: `row`, justifyContent: `space-around`, gap: `3vw` }}>
            {salasComGrupos.map((sala) => (
                <div key={sala.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', gap: '.7vh', padding: 10, border: '1px solid gray', textAlign: 'center' }}>
                    <h2>Sala: {sala.id}</h2>
                    <hr />

                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '2vh' }}>
                        <div style={{ flex: '1 0 0', display: 'flex', flexDirection: 'column', textAlign: 'start', overflow: 'auto', gap: '1vh' }}>
                            {sala.grupos.map((grupo, idx) => {
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

                        {sala.podeEscrever && (
                            <div style={{ flex: '0 0 0', width: '100%' }}>
                                <input
                                    style={{ width: '100%' }}
                                    type="text"
                                    placeholder="Digite sua mensagem..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const input = e.target as HTMLInputElement;
                                            if (!input.value.trim()) return;
                                            enviarMensagem(sala.id, input.value.trim());
                                            input.value = '';
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}