'use client';

import styles from './styles.module.css';

import { useContexto__PaginaCadastrar__EmailEnviado } from 'Contextos/Contexto__PaginaCadastrar__EmailEnviado/contexto';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';

export default function SPA__PaginaCadastrar__EmailEnviado() {
    const { email, reenvioSolicitado, aoReenviar, aoIrParaAcessar } = useContexto__PaginaCadastrar__EmailEnviado();

    return (
        <div className={styles.telaEmailEnviado}>
            <div className={styles.areaMensagem}>
                <h1>Confira seu Email</h1>

                <ConteudoForm>
                    <ConteudoForm.AreaCorpo>
                        <div className={styles.mensagem}>
                            <span>Enviamos um link de verificação para</span>
                            <span className={styles.emailDestacado}>{email}</span>
                            <span>A conta é ativada ao abrir o link, que expira em 24 horas</span>
                            {!reenvioSolicitado && <span className={styles.linkAcao} onClick={() => { void aoReenviar(); }}>Não chegou? Reenviar email</span>}
                            {reenvioSolicitado && <span>Email reenviado</span>}
                        </div>
                    </ConteudoForm.AreaCorpo>

                    <ConteudoForm.AreaBotoes>
                        <button onClick={aoIrParaAcessar}>Ir para Acessar</button>
                    </ConteudoForm.AreaBotoes>
                </ConteudoForm>
            </div>
        </div>
    );
};