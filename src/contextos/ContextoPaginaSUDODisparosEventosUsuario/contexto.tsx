'use client';

import { ChangeEvent, createContext, useContext, useState } from 'react';
import { Eventos_Envia, SOCKET_UsuarioExistente } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';
import { useAppSelector } from 'Redux/hooks/useRedux';

interface ContextoPaginaSUDODisparosEventosUsuarioProps {
    usuarios: SOCKET_UsuarioExistente[];
    idAlvo: number | null;
    idsAlvo: number[];
    onChangeAlvo: (e: ChangeEvent<HTMLSelectElement>) => void;
    onChangeAlvos: (e: ChangeEvent<HTMLSelectElement>) => void;
    podeDispararDirecionado: boolean;
    podeDispararConvite: boolean;
    dispararParaTodos: () => void;
    dispararParaUsuario: () => void;
    dispararPersistente: () => void;
    dispararConvite: () => void;
};

const ContextoPaginaSUDODisparosEventosUsuario = createContext<ContextoPaginaSUDODisparosEventosUsuarioProps | undefined>(undefined);

export const useContextoPaginaSUDODisparosEventosUsuario = (): ContextoPaginaSUDODisparosEventosUsuarioProps => {
    const context = useContext(ContextoPaginaSUDODisparosEventosUsuario);
    if (!context) throw new Error('useContextoPaginaSUDODisparosEventosUsuario precisa estar dentro de um ContextoPaginaSUDODisparosEventosUsuario');
    return context;
};

export const ContextoPaginaSUDODisparosEventosUsuarioProvider = ({ children }: { children: React.ReactNode }) => {
    const usuarios = useAppSelector(state => state.usuarios.usuarios);
    const [idAlvo, setIdAlvo] = useState<number | null>(null);
    const [idsAlvo, setIdsAlvo] = useState<number[]>([]);

    const podeDispararDirecionado = idAlvo !== null;
    const podeDispararConvite = idsAlvo.length > 0;

    const onChangeAlvo = (e: ChangeEvent<HTMLSelectElement>) => setIdAlvo(e.target.value ? Number(e.target.value) : null);
    const onChangeAlvos = (e: ChangeEvent<HTMLSelectElement>) => setIdsAlvo(Array.from(e.target.selectedOptions, o => Number(o.value)));

    const dispararParaTodos = () => { eventoWs(Eventos_Envia.EventosUsuario.eventos.dispararNotificacaoTeste, {}); };
    const dispararParaUsuario = () => { if (idAlvo !== null) eventoWs(Eventos_Envia.EventosUsuario.eventos.dispararNotificacaoTesteParaUsuario, { idUsuario: idAlvo }); };
    const dispararPersistente = () => { if (idAlvo !== null) eventoWs(Eventos_Envia.EventosUsuario.eventos.dispararNotificacaoPersistenteParaUsuario, { idUsuario: idAlvo }); };
    const dispararConvite = () => { if (idsAlvo.length > 0) eventoWs(Eventos_Envia.EventosUsuario.eventos.dispararConviteSessaoTeste, { idsUsuarios: idsAlvo }); };

    return (
        <ContextoPaginaSUDODisparosEventosUsuario.Provider value={{ usuarios, idAlvo, idsAlvo, onChangeAlvo, onChangeAlvos, podeDispararDirecionado, podeDispararConvite, dispararParaTodos, dispararParaUsuario, dispararPersistente, dispararConvite }}>
            {children}
        </ContextoPaginaSUDODisparosEventosUsuario.Provider>
    );
};