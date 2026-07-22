'use client';

import styles from './styles.module.css';

import { useContexto__PaginaCadastrar__Formulario } from 'Contextos/Contexto__PaginaCadastrar__Formulario/contexto';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { ConteudoTermoAceite } from 'Componentes/ElementosDeJogo/ModalPrimeiroAcesso/page';

export default function SPA__PaginaCadastrar__Formulario() {
    const { formularioCadastro, erroCadastro, mostrarTermos, setMostrarTermos, checkTopicosSensiveis, setCheckTopicosSensiveis, termo1, setTermo1, termo2, setTermo2, termosAceitos, podeProsseguir, aoVoltarParaAcessar } = useContexto__PaginaCadastrar__Formulario();

    if (mostrarTermos) {
        return (
            <div className={styles.telaTermos}>
                <h1>Termos de Aceite</h1>
                <div className={styles.corpoTermos}>
                    <ConteudoTermoAceite checkTopicosSensiveis={checkTopicosSensiveis} termo1={termo1} termo2={termo2} setCheckTopicosSensiveis={setCheckTopicosSensiveis} setTermo1={setTermo1} setTermo2={setTermo2} onVoltar={() => setMostrarTermos(false)} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.telaCadastrar}>
            <div className={styles.areaCadastro}>
                <h1>Criar Conta</h1>

                <ConteudoForm>
                    <ConteudoForm.AreaCorpo>
                        <div className={styles.camposCadastro}>
                            <InputComRotulo rotulo={'Apelido'}>
                                <input type="text" {...formularioCadastro.input('apelido')} />
                            </InputComRotulo>

                            <InputComRotulo rotulo={'Email'}>
                                <input type="text" {...formularioCadastro.input('email')} />
                            </InputComRotulo>

                            <InputComRotulo rotulo={'Senha'}>
                                <input type="password" {...formularioCadastro.input('senha')} />
                            </InputComRotulo>

                            <InputComRotulo rotulo={'Confirmação da Senha'}>
                                <input type="password" {...formularioCadastro.input('confirmarSenha')} />
                            </InputComRotulo>

                            <span className={`${styles.linkTermos} ${!termosAceitos ? styles.pendente : ''}`} onClick={() => setMostrarTermos(true)}>{termosAceitos ? 'Termos de Aceite aceitos' : 'Ler e aceitar os Termos de Aceite'}</span>

                            {erroCadastro && <span className={styles.erroCadastro}>{erroCadastro}</span>}
                        </div>
                    </ConteudoForm.AreaCorpo>

                    <ConteudoForm.AreaBotoes>
                        <button onClick={formularioCadastro.salvar} disabled={!podeProsseguir || formularioCadastro.salvando}>{formularioCadastro.salvando ? 'Cadastrando…' : 'Prosseguir'}</button>
                        <button data-variante="secundario" onClick={aoVoltarParaAcessar}>Voltar</button>
                    </ConteudoForm.AreaBotoes>
                </ConteudoForm>
            </div>
        </div>
    );
};