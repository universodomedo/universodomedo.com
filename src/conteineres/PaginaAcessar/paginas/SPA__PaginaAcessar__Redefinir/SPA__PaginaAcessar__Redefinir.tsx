'use client';

import styles from './styles.module.css';

import { useContexto__PaginaAcessar__Redefinir } from 'Contextos/Contexto__PaginaAcessar__Redefinir/contexto';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';

export default function SPA__PaginaAcessar__Redefinir() {
    const { formularioRedefinir, redefinida, erroRedefinicao, voltarParaLogin } = useContexto__PaginaAcessar__Redefinir();

    return (
        <div className={styles.telaRedefinir}>
            <div className={styles.areaRedefinir}>
                <h1>Nova Senha</h1>

                <ConteudoForm>
                    <ConteudoForm.AreaCorpo>
                        {redefinida ? (
                            <div className={styles.mensagemRedefinida}>
                                <span>Senha redefinida com sucesso</span>
                                <span>Entre com a nova senha</span>
                            </div>
                        ) : (
                            <div className={styles.camposRedefinir}>
                                <InputComRotulo rotulo={'Nova Senha'}>
                                    <input type="password" {...formularioRedefinir.input('novaSenha')} />
                                </InputComRotulo>

                                <InputComRotulo rotulo={'Confirmação da Nova Senha'}>
                                    <input type="password" {...formularioRedefinir.input('confirmarSenha')} />
                                </InputComRotulo>

                                {erroRedefinicao && <span className={styles.erroRedefinir}>{erroRedefinicao}</span>}
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
            </div>
        </div>
    );
};