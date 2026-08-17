'use client';

import styles from './styles.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

import { useContexto__PaginaAcessar__Login } from 'Contextos/Contexto__PaginaAcessar__Login/contexto';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import CampoSenha from 'Componentes/Elementos/Inputs/CampoSenha/CampoSenha';
import PainelAcesso from 'Componentes/ElementosVisuais/PainelAcesso/PainelAcesso';

export default function SPA__PaginaAcessar__Login() {
    const { formularioLogin, erroLogin, loginPendenteDeVerificacao, reenvioSolicitado, verificacaoEmail, recusaDiscord, jaAutenticado, aoReenviarVerificacao, aoEntrarComDiscord, aoCriarConta, aoIrParaMinhaPagina, irParaRecuperar } = useContexto__PaginaAcessar__Login();

    // Tudo que aparece e some fica no slot de avisos do painel, fora do fluxo: campos e botões não se mexem quando surge sucesso, erro ou confirmação de reenvio.
    const avisos = (
        <>
            {verificacaoEmail.situacao !== 'NENHUMA' && <span className={verificacaoEmail.situacao === 'FALHA' ? styles.avisoFalha : styles.avisoSucesso}>{verificacaoEmail.situacao === 'VERIFICANDO' ? 'Verificando seu email…' : verificacaoEmail.mensagem}</span>}
            {recusaDiscord === 'JA_MIGRADO' && <span className={styles.avisoSucesso}>Você já migrou seu acesso. Entre com seu email e senha</span>}
            {recusaDiscord === 'SEM_CONTA' && <span className={styles.avisoFalha}>Não encontramos conta vinculada a este Discord. O acesso pelo Discord está sendo encerrado — crie sua conta com email e senha</span>}
            {erroLogin && <span className={styles.avisoFalha}>{erroLogin}</span>}
            {loginPendenteDeVerificacao && !reenvioSolicitado && <span className={styles.linkAcao} onClick={() => { void aoReenviarVerificacao(); }}>Reenviar email de verificação</span>}
            {reenvioSolicitado && <span className={styles.avisoSucesso}>Se a conta existir, reenviamos o email de verificação</span>}
        </>
    );

    return (
        <PainelAcesso titulo={'Acessar'} avisos={avisos}>
            <ConteudoForm>
                <ConteudoForm.AreaCorpo>
                    {jaAutenticado ? (
                        <div className={styles.campos}>
                            <span className={styles.textoNeutro}>Você já está conectado</span>
                        </div>
                    ) : (
                        <div className={styles.campos}>
                            <InputComRotulo rotulo={'Email ou Apelido'}>
                                <input type="text" autoComplete="username" {...formularioLogin.input('identificador')} />
                            </InputComRotulo>

                            <InputComRotulo rotulo={'Senha'}>
                                <CampoSenha autoComplete="current-password" {...formularioLogin.input('senha')} />
                            </InputComRotulo>

                            <span className={styles.linkAcao} onClick={irParaRecuperar}>Esqueci minha senha</span>

                            <div className={styles.migracaoDiscord}>
                                <span className={styles.textoNeutro}>Já jogava antes? Migre seu acesso</span>
                                <FontAwesomeIcon className={styles.botaoDiscord} icon={faDiscord} onClick={aoEntrarComDiscord} />
                            </div>
                        </div>
                    )}
                </ConteudoForm.AreaCorpo>

                <ConteudoForm.AreaBotoes>
                    {jaAutenticado ? (
                        <button onClick={aoIrParaMinhaPagina}>Ir para Minha Página</button>
                    ) : (
                        <>
                            <button onClick={formularioLogin.salvar} disabled={!formularioLogin.podeSalvar || formularioLogin.salvando}>{formularioLogin.salvando ? 'Entrando…' : 'Entrar'}</button>
                            <button data-variante="secundario" onClick={aoCriarConta}>Criar Conta</button>
                        </>
                    )}
                </ConteudoForm.AreaBotoes>
            </ConteudoForm>
        </PainelAcesso>
    );
};