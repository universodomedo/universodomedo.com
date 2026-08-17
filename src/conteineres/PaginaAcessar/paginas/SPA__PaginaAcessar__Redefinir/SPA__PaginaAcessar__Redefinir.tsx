'use client';

import styles from './styles.module.css';

import { useContexto__PaginaAcessar__Redefinir } from 'Contextos/Contexto__PaginaAcessar__Redefinir/contexto';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import CampoSenha from 'Componentes/Elementos/Inputs/CampoSenha/CampoSenha';
import PainelAcesso from 'Componentes/ElementosVisuais/PainelAcesso/PainelAcesso';

export default function SPA__PaginaAcessar__Redefinir() {
    const { formularioRedefinir, redefinida, erroRedefinicao, voltarParaLogin } = useContexto__PaginaAcessar__Redefinir();

    return (
        <PainelAcesso titulo={'Nova Senha'} avisos={erroRedefinicao ? <span className={styles.avisoFalha}>{erroRedefinicao}</span> : null}>
            <ConteudoForm>
                <ConteudoForm.AreaCorpo>
                    {redefinida ? (
                        <div className={styles.mensagem}>
                            <span>Senha redefinida com sucesso</span>
                            <span className={styles.detalhe}>Entre com a nova senha</span>
                        </div>
                    ) : (
                        <div className={styles.campos}>
                            <InputComRotulo rotulo={'Nova Senha'}>
                                <CampoSenha autoComplete="new-password" {...formularioRedefinir.input('novaSenha')} />
                            </InputComRotulo>

                            <InputComRotulo rotulo={'Confirmação da Nova Senha'}>
                                <CampoSenha autoComplete="new-password" {...formularioRedefinir.input('confirmarSenha')} />
                            </InputComRotulo>
                        </div>
                    )}
                </ConteudoForm.AreaCorpo>

                <ConteudoForm.AreaBotoes>
                    {redefinida ? (
                        <button onClick={voltarParaLogin}>Ir para o Login</button>
                    ) : (
                        <>
                            <button onClick={formularioRedefinir.salvar} disabled={!formularioRedefinir.podeSalvar || formularioRedefinir.salvando}>{formularioRedefinir.salvando ? 'Redefinindo…' : 'Redefinir Senha'}</button>
                            <button data-variante="secundario" onClick={voltarParaLogin}>Voltar</button>
                        </>
                    )}
                </ConteudoForm.AreaBotoes>
            </ConteudoForm>
        </PainelAcesso>
    );
};