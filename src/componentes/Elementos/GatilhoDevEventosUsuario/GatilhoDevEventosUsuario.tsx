'use client';

import { useState } from 'react';
import { Eventos_Envia, Eventos_EnviaERecebe, CAPACIDADES, EventoUsuarioDto } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';
import { useAppSelector } from 'Redux/hooks/useRedux';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

// SCAFFOLDING dev (Etapas 1-6): leitura dos próprios eventos para qualquer autenticado; disparos só para admin. Temporário.
export default function GatilhoDevEventosUsuario() {
    const { estaAutenticado, verificarCapacidade } = useContextoAutenticacao();
    const usuarios = useAppSelector(state => state.usuarios.usuarios);
    const [idAlvo, setIdAlvo] = useState<number | null>(null);
    const [idsAlvo, setIdsAlvo] = useState<number[]>([]);
    const [eventos, setEventos] = useState<EventoUsuarioDto[]>([]);

    if (!estaAutenticado) return null;

    const ehAdmin = verificarCapacidade(CAPACIDADES.ADMINISTRADOR__SUDO__BURLAR_CAPACIDADES);

    const listar = () => { eventoWs(Eventos_EnviaERecebe.EventosUsuario.eventos.obterMeusEventos, {}, resp => setEventos(resp.eventos)); };
    const marcarLido = (idEvento: number) => { eventoWs(Eventos_EnviaERecebe.EventosUsuario.eventos.marcarEventoComoLido, { idEvento }, resp => setEventos(resp.eventos)); };

    const dispararParaTodos = () => { eventoWs(Eventos_Envia.EventosUsuario.eventos.dispararNotificacaoTeste, {}); };
    const dispararParaUsuario = () => { if (idAlvo !== null) eventoWs(Eventos_Envia.EventosUsuario.eventos.dispararNotificacaoTesteParaUsuario, { idUsuario: idAlvo }); };
    const dispararPersistente = () => { if (idAlvo !== null) eventoWs(Eventos_Envia.EventosUsuario.eventos.dispararNotificacaoPersistenteParaUsuario, { idUsuario: idAlvo }); };
    const dispararConvite = () => { if (idsAlvo.length > 0) eventoWs(Eventos_Envia.EventosUsuario.eventos.dispararConviteSessaoTeste, { idsUsuarios: idsAlvo }); };

    return (
        <div style={{ position: 'fixed', bottom: '1em', right: '1em', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '0.5em', padding: '0.5em', borderRadius: '0.375em', border: '0.1em solid #fff', background: '#111', color: '#fff', fontSize: '0.75em', maxWidth: '20em' }}>
            <button type="button" onClick={listar} style={{ cursor: 'pointer' }}>[DEV] Listar meus eventos</button>
            {eventos.map(evento => (
                <div key={evento.id} style={{ display: 'flex', gap: '0.25em', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{evento.titulo} {evento.dataLeitura ? '(lido)' : '(não lido)'}</span>
                    <button type="button" onClick={() => marcarLido(evento.id)} disabled={!!evento.dataLeitura} style={{ cursor: 'pointer' }}>lido</button>
                </div>
            ))}

            {ehAdmin && (
                <>
                    <button type="button" onClick={dispararParaTodos} style={{ cursor: 'pointer' }}>[DEV] Disparar para todos online</button>
                    <select value={idAlvo ?? ''} onChange={e => setIdAlvo(e.target.value ? Number(e.target.value) : null)}>
                        <option value="">— escolher usuário —</option>
                        {usuarios.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                    </select>
                    <div style={{ display: 'flex', gap: '0.25em' }}>
                        <button type="button" onClick={dispararParaUsuario} disabled={idAlvo === null} style={{ cursor: 'pointer' }}>[DEV] Disparar direcionado</button>
                        <button type="button" onClick={dispararPersistente} disabled={idAlvo === null} style={{ cursor: 'pointer' }}>[DEV] Disparar persistente</button>
                    </div>
                    <select multiple value={idsAlvo.map(String)} onChange={e => setIdsAlvo(Array.from(e.target.selectedOptions, o => Number(o.value)))} style={{ minHeight: '4em' }}>
                        {usuarios.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                    </select>
                    <button type="button" onClick={dispararConvite} disabled={idsAlvo.length === 0} style={{ cursor: 'pointer' }}>[DEV] Disparar convite persistente</button>
                </>
            )}
        </div>
    );
};
