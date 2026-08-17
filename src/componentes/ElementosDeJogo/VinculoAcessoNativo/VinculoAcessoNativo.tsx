'use client';

import styles from './styles.module.css';

import { useState } from 'react';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import useFormularioCreate, { defineFormularioCreate } from 'Hooks/useFormularioCreate';
import useLogout from 'Hooks/useLogout';
import { corrigirEmailAcessoPendente, criarAcessoParaMinhaConta, extraiMotivoErroAcesso, reenviarMinhaVerificacao } from 'Funcionalidades/Acessos/acessos.api';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import CampoSenha from 'Componentes/Elementos/Inputs/CampoSenha/CampoSenha';

type DTO__Vinculo = { email: string; senha: string; confirmarSenha: string };
type DTO__CorrigirEmail = { email: string };

const FORMULARIO_VINCULO = defineFormularioCreate<DTO__Vinculo>({
    valoresIniciais: { email: '', senha: '', confirmarSenha: '' },
    campos: {
        email: { tipo: 'text', label: 'Email', obrigatorio: true, placeholder: 'Seu email real' },
        senha: { tipo: 'text', label: 'Senha', obrigatorio: true, trim: false },
        confirmarSenha: { tipo: 'text', label: 'Confirmação da senha', obrigatorio: true, trim: false },
    },
});

const FORMULARIO_CORRIGIR = defineFormularioCreate<DTO__CorrigirEmail>({
    valoresIniciais: { email: '' },
    campos: {
        email: { tipo: 'text', label: 'Email correto', obrigatorio: true },
    },
});

/** Gate global da transição do legado Discord: usuário autenticado só segue com acesso nativo CRIADO E VERIFICADO (Discord não é validador — a transição precisa terminar). As saídas de emergência garantem que ninguém fica preso: Reenviar, Corrigir email, Já verifiquei e Sair (volta para a parte pública do site). Justificativa de tamanho: gate único e coeso com as duas vistas do mesmo fluxo. */
export default function VinculoAcessoNativo() {
    const { checkAuth, situacaoAcessoNativo, emailAcessoNativo } = useContextoAutenticacao();
    const { logout } = useLogout();
    const [erroVinculo, setErroVinculo] = useState<string | null>(null);
    const [reenvioFeito, setReenvioFeito] = useState(false);
    const [mostrarCorrigirEmail, setMostrarCorrigirEmail] = useState(false);

    const formularioVinculo = useFormularioCreate(FORMULARIO_VINCULO, async payload => {
        setErroVinculo(null);
        if (payload.senha !== payload.confirmarSenha) { setErroVinculo('A confirmação não confere com a senha'); return; }

        try {
            await criarAcessoParaMinhaConta(payload.email, payload.senha);
            await checkAuth();
        } catch (erroCapturado) {
            setErroVinculo(extraiMotivoErroAcesso(erroCapturado instanceof Error ? erroCapturado : null, 'Não foi possível criar o acesso'));
        }
    });

    const formularioCorrigir = useFormularioCreate(FORMULARIO_CORRIGIR, async payload => {
        setErroVinculo(null);
        try {
            await corrigirEmailAcessoPendente(payload.email);
            setMostrarCorrigirEmail(false);
            setReenvioFeito(true);
            await checkAuth();
        } catch (erroCapturado) {
            setErroVinculo(extraiMotivoErroAcesso(erroCapturado instanceof Error ? erroCapturado : null, 'Não foi possível corrigir o email'));
        }
    });

    async function aoReenviar(): Promise<void> {
        setErroVinculo(null);
        await reenviarMinhaVerificacao();
        setReenvioFeito(true);
    };

    const pendente = situacaoAcessoNativo === 'PENDENTE_VERIFICACAO';

    return (
        <div className={styles.telaVinculo}>
            <div className={styles.areaVinculo}>
                <h1>{pendente ? 'Verifique seu Email' : 'Vincule seu Acesso'}</h1>

                <ConteudoForm>
                    <ConteudoForm.AreaCorpo>
                        {pendente ? (
                            <div className={styles.camposVinculo}>
                                <div className={styles.mensagemEnviada}>
                                    <span>Enviamos um link de verificação para</span>
                                    <span className={styles.emailDestacado}>{emailAcessoNativo}</span>
                                    <span>Abra o link para ativar seu acesso e continuar — a partir daí sua entrada passa a ser por email e senha</span>
                                    {reenvioFeito && <span>Email reenviado</span>}
                                </div>

                                {mostrarCorrigirEmail ? (
                                    <InputComRotulo rotulo={'Email correto'}>
                                        <input type="text" autoComplete="email" {...formularioCorrigir.input('email')} />
                                    </InputComRotulo>
                                ) : (
                                    <span className={styles.linkAcao} onClick={() => setMostrarCorrigirEmail(true)}>Errei o email — corrigir</span>
                                )}

                                {erroVinculo && <span className={styles.erroVinculo}>{erroVinculo}</span>}
                            </div>
                        ) : (
                            <div className={styles.camposVinculo}>
                                <span className={styles.explicacao}>O acesso pelo Discord está sendo encerrado: a partir de agora a entrada é por email e senha. Crie suas credenciais para continuar — sua conta, personagens e progresso permanecem os mesmos</span>

                                <InputComRotulo rotulo={'Email'}>
                                    <input type="text" autoComplete="email" {...formularioVinculo.input('email')} />
                                </InputComRotulo>

                                <InputComRotulo rotulo={'Senha'}>
                                    <CampoSenha autoComplete="new-password" {...formularioVinculo.input('senha')} />
                                </InputComRotulo>

                                <InputComRotulo rotulo={'Confirmação da Senha'}>
                                    <CampoSenha autoComplete="new-password" {...formularioVinculo.input('confirmarSenha')} />
                                </InputComRotulo>

                                {erroVinculo && <span className={styles.erroVinculo}>{erroVinculo}</span>}
                            </div>
                        )}
                    </ConteudoForm.AreaCorpo>

                    <ConteudoForm.AreaBotoes>
                        {pendente ? (
                            mostrarCorrigirEmail ? (
                                <>
                                    <button onClick={formularioCorrigir.salvar} disabled={!formularioCorrigir.podeSalvar || formularioCorrigir.salvando}>{formularioCorrigir.salvando ? 'Corrigindo…' : 'Corrigir e Reenviar'}</button>
                                    <button data-variante="secundario" onClick={() => setMostrarCorrigirEmail(false)}>Cancelar</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => { void checkAuth(); }}>Já Verifiquei</button>
                                    <button data-variante="secundario" onClick={() => { void aoReenviar(); }}>Reenviar Email</button>
                                </>
                            )
                        ) : (
                            <button onClick={formularioVinculo.salvar} disabled={!formularioVinculo.podeSalvar || formularioVinculo.salvando}>{formularioVinculo.salvando ? 'Criando…' : 'Criar Acesso'}</button>
                        )}
                    </ConteudoForm.AreaBotoes>
                </ConteudoForm>

                {/* Saída obrigatória: o gate tranca a navegação, então sem isto quem não pode concluir agora fica preso na tela, sem voltar para a parte pública do site. */}
                <span className={styles.linkSair} onClick={logout}>Sair</span>
            </div>
        </div>
    );
};