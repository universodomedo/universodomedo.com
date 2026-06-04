'use client';

import { useState } from 'react';
import { Eventos_Envia, CAPACIDADES } from 'types-nora-api';

import { eventoWs } from 'Hooks/useEventoWs';
import { useAppSelector } from 'Redux/hooks/useRedux';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

// SCAFFOLDING dev/admin (Etapas 1-5): gatilhos temporários de teste. Auto-oculta para não-admin.
export default function GatilhoDevEventosUsuario() {
    const { verificarCapacidade } = useContextoAutenticacao();
    const usuarios = useAppSelector(state => state.usuarios.usuarios);
    const [idAlvo, setIdAlvo] = useState<number | null>(null);
    const [idsAlvo, setIdsAlvo] = useState<number[]>([]);

    if (!verificarCapacidade(CAPACIDADES.ADMINISTRADOR__SUDO__BURLAR_CAPACIDADES)) return null;

    const dispararParaTodos = () => { eventoWs(Eventos_Envia.EventosUsuario.eventos.dispararNotificacaoTeste, {}); };
    const dispararParaUsuario = () => { if (idAlvo !== null) eventoWs(Eventos_Envia.EventosUsuario.eventos.dispararNotificacaoTesteParaUsuario, { idUsuario: idAlvo }); };
    const dispararPersistente = () => { if (idAlvo !== null) eventoWs(Eventos_Envia.EventosUsuario.eventos.dispararNotificacaoPersistenteParaUsuario, { idUsuario: idAlvo }); };
    const dispararConvite = () => { if (idsAlvo.length > 0) eventoWs(Eventos_Envia.EventosUsuario.eventos.dispararConviteSessaoTeste, { idsUsuarios: idsAlvo }); };

    return (
        <div style={{ position: 'fixed', bottom: '1em', right: '1em', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '0.5em', padding: '0.5em', borderRadius: '0.375em', border: '0.1em solid #fff', background: '#111', color: '#fff', fontSize: '0.75em' }}>
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
        </div>
    );
};
