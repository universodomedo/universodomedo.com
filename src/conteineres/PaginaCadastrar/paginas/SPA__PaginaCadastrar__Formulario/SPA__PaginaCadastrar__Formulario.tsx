'use client';

import styles from './styles.module.css';

import { useContexto__PaginaCadastrar__Formulario } from 'Contextos/Contexto__PaginaCadastrar__Formulario/contexto';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import CampoTurnstile from 'Componentes/Elementos/Inputs/CampoTurnstile/CampoTurnstile';
import CampoSenha from 'Componentes/Elementos/Inputs/CampoSenha/CampoSenha';
import PainelAcesso from 'Componentes/ElementosVisuais/PainelAcesso/PainelAcesso';

export default function SPA__PaginaCadastrar__Formulario() {
    const { formularioCadastro, erroCadastro, setTokenCaptcha, podeProsseguir, aoVoltarParaAcessar } = useContexto__PaginaCadastrar__Formulario();

    return (
        <PainelAcesso titulo={'Criar Conta'} avisos={erroCadastro ? <span className={styles.avisoFalha}>{erroCadastro}</span> : null}>
            <ConteudoForm>
                <ConteudoForm.AreaCorpo>
                    <div className={styles.campos}>
                        <InputComRotulo rotulo={'Email'}>
                            <input type="text" autoComplete="email" {...formularioCadastro.input('email')} />
                        </InputComRotulo>

                        <InputComRotulo rotulo={'Senha'}>
                            <CampoSenha autoComplete="new-password" {...formularioCadastro.input('senha')} />
                        </InputComRotulo>

                        <InputComRotulo rotulo={'Confirmação da Senha'}>
                            <CampoSenha autoComplete="new-password" {...formularioCadastro.input('confirmarSenha')} />
                        </InputComRotulo>

                        <CampoTurnstile aoMudarToken={setTokenCaptcha} />
                    </div>
                </ConteudoForm.AreaCorpo>

                <ConteudoForm.AreaBotoes>
                    <button onClick={formularioCadastro.salvar} disabled={!podeProsseguir || formularioCadastro.salvando}>{formularioCadastro.salvando ? 'Cadastrando…' : 'Prosseguir'}</button>
                    <button data-variante="secundario" onClick={aoVoltarParaAcessar}>Voltar</button>
                </ConteudoForm.AreaBotoes>
            </ConteudoForm>
        </PainelAcesso>
    );
};