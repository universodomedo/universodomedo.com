'use client';

import styles from './styles.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

import { useContexto__PaginaAcessar__Login } from 'Contextos/Contexto__PaginaAcessar__Login/contexto';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import RecipienteArquivoInterno from 'Uteis/ImagemLoader/RecipienteArquivoInterno';

export default function SPA__PaginaAcessar__Login() {
    const { formularioLogin, erroLogin, loginPendenteDeVerificacao, reenvioSolicitado, verificacaoEmail, aoReenviarVerificacao, aoEntrarComDiscord, aoCriarConta, irParaRecuperar } = useContexto__PaginaAcessar__Login();

    return (
        <div className={styles.telaAcessar}>
            <div className={styles.cartaoArte}>
                <RecipienteArquivoInterno arquivo={'CARD_ACESSAR'} />
            </div>

            <div className={styles.areaAcesso}>
                <h1>Acessar</h1>

                {verificacaoEmail.situacao !== 'NENHUMA' && (
                    <div className={`${styles.bannerVerificacao} ${verificacaoEmail.situacao === 'FALHA' ? styles.falha : ''}`}>
                        {verificacaoEmail.situacao === 'VERIFICANDO' ? <span>Verificando seu email…</span> : <span>{verificacaoEmail.mensagem}</span>}
                    </div>
                )}

                <ConteudoForm>
                    <ConteudoForm.AreaCorpo>
                        <div className={styles.camposLogin}>
                            <InputComRotulo rotulo={'Email ou Apelido'}>
                                <input type="text" {...formularioLogin.input('identificador')} />
                            </InputComRotulo>

                            <InputComRotulo rotulo={'Senha'}>
                                <input type="password" {...formularioLogin.input('senha')} />
                            </InputComRotulo>

                            <span className={styles.linkAcao} onClick={irParaRecuperar}>Esqueci minha senha</span>

                            {erroLogin && <span className={styles.erroLogin}>{erroLogin}</span>}
                            {loginPendenteDeVerificacao && !reenvioSolicitado && <span className={styles.linkAcao} onClick={() => { void aoReenviarVerificacao(); }}>Reenviar email de verificação</span>}
                            {reenvioSolicitado && <span className={styles.reenvioConfirmado}>Se a conta existir, reenviamos o email de verificação</span>}

                            <div className={styles.acessoDiscord}>
                                <span>Já tem conta pelo Discord?</span>
                                <FontAwesomeIcon className={styles.botaoDiscord} icon={faDiscord} onClick={aoEntrarComDiscord} />
                            </div>
                        </div>
                    </ConteudoForm.AreaCorpo>

                    <ConteudoForm.AreaBotoes>
                        <button onClick={formularioLogin.salvar} disabled={!formularioLogin.podeSalvar || formularioLogin.salvando}>{formularioLogin.salvando ? 'Entrando…' : 'Entrar'}</button>
                        <button data-variante="secundario" onClick={aoCriarConta}>Criar Conta</button>
                    </ConteudoForm.AreaBotoes>
                </ConteudoForm>
            </div>
        </div>
    );
};