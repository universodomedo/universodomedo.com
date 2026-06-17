'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaSUDODisparosEventosUsuarioProvider, useContextoPaginaSUDODisparosEventosUsuario } from 'Contextos/ContextoPaginaSUDODisparosEventosUsuario/contexto';

export function DisparosEventosUsuario_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.admin.disparosEventosUsuario}>
            <ContextoPaginaSUDODisparosEventosUsuarioProvider>
                <DisparosEventosUsuario_Contexto />
            </ContextoPaginaSUDODisparosEventosUsuarioProvider>
        </ControladorSlot>
    );
};

function DisparosEventosUsuario_Contexto() {
    const { usuarios, idAlvo, idsAlvo, onChangeAlvo, onChangeAlvos, podeDispararDirecionado, podeDispararConvite, dispararParaTodos, dispararParaUsuario, dispararPersistente, dispararConvite } = useContextoPaginaSUDODisparosEventosUsuario();

    return (
        <div className={styles.painel}>
            <button type="button" className={styles.botao} onClick={dispararParaTodos}>[DEV] Disparar para todos online</button>

            <select className={styles.select} value={idAlvo ?? ''} onChange={onChangeAlvo}>
                <option value="">— escolher usuário —</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
            </select>

            <div className={styles.linhaBotoes}>
                <button type="button" className={styles.botao} onClick={dispararParaUsuario} disabled={!podeDispararDirecionado}>[DEV] Disparar direcionado</button>
                <button type="button" className={styles.botao} onClick={dispararPersistente} disabled={!podeDispararDirecionado}>[DEV] Disparar persistente</button>
            </div>

            <select multiple className={styles.selectMultiplo} value={idsAlvo.map(String)} onChange={onChangeAlvos}>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
            </select>

            <button type="button" className={styles.botao} onClick={dispararConvite} disabled={!podeDispararConvite}>[DEV] Disparar convite persistente</button>
        </div>
    );
};