'use client';

import styles from './styles.module.css';

import { useContexto__PaginaAcessar__Recuperar } from 'Contextos/Contexto__PaginaAcessar__Recuperar/contexto';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';

export default function SPA__PaginaAcessar__Recuperar() {
    const { formularioRecuperar, solicitado, erroSolicitacao, voltarParaLogin } = useContexto__PaginaAcessar__Recuperar();

    return (
        <div className={styles.telaRecuperar}>
            <div className={styles.areaRecuperar}>
                <h1>Recuperar Senha</h1>

                <ConteudoForm>
                    <ConteudoForm.AreaCorpo>
                        {solicitado ? (
                            <div className={styles.mensagemEnviada}>
                                <span>Se a conta existir e estiver verificada, enviamos um link de recuperação para o email dela</span>
                                <span>O link expira em 1 hora</span>
                            </div>
                        ) : (
                            <div className={styles.camposRecuperar}>
                                <InputComRotulo rotulo={'Email ou Apelido'}>
                                    <input type="text" {...formularioRecuperar.input('identificador')} />
                                </InputComRotulo>

                                {erroSolicitacao && <span className={styles.erroRecuperar}>{erroSolicitacao}</span>}
                            </div>
                        )}
                    </ConteudoForm.AreaCorpo>

                    <ConteudoForm.AreaBotoes>
                        {!solicitado && <button onClick={formularioRecuperar.salvar} disabled={!formularioRecuperar.podeSalvar || formularioRecuperar.salvando}>{formularioRecuperar.salvando ? 'Enviando…' : 'Enviar Link'}</button>}
                        <button data-variante="secundario" onClick={voltarParaLogin}>Voltar</button>
                    </ConteudoForm.AreaBotoes>
                </ConteudoForm>
            </div>
        </div>
    );
};