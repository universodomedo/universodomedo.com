'use client';

import styles from './styles.module.css';

import { useContexto__PaginaAcessar__Recuperar } from 'Contextos/Contexto__PaginaAcessar__Recuperar/contexto';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import PainelAcesso from 'Componentes/ElementosVisuais/PainelAcesso/PainelAcesso';

export default function SPA__PaginaAcessar__Recuperar() {
    const { formularioRecuperar, solicitado, erroSolicitacao, voltarParaLogin } = useContexto__PaginaAcessar__Recuperar();

    return (
        <PainelAcesso titulo={'Recuperar Senha'} avisos={erroSolicitacao ? <span className={styles.avisoFalha}>{erroSolicitacao}</span> : null}>
            <ConteudoForm>
                <ConteudoForm.AreaCorpo>
                    {solicitado ? (
                        <div className={styles.mensagem}>
                            <span>Se a conta existir e estiver verificada, enviamos um link de recuperação para o email dela</span>
                            <span className={styles.detalhe}>O link expira em 1 hora</span>
                        </div>
                    ) : (
                        <div className={styles.campos}>
                            <InputComRotulo rotulo={'Email ou Apelido'}>
                                <input type="text" autoComplete="username" {...formularioRecuperar.input('identificador')} />
                            </InputComRotulo>
                        </div>
                    )}
                </ConteudoForm.AreaCorpo>

                <ConteudoForm.AreaBotoes>
                    {!solicitado && <button onClick={formularioRecuperar.salvar} disabled={!formularioRecuperar.podeSalvar || formularioRecuperar.salvando}>{formularioRecuperar.salvando ? 'Enviando…' : 'Enviar Link'}</button>}
                    <button data-variante="secundario" onClick={voltarParaLogin}>Voltar</button>
                </ConteudoForm.AreaBotoes>
            </ConteudoForm>
        </PainelAcesso>
    );
};