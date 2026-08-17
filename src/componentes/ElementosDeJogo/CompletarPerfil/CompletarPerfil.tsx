'use client';

import styles from './styles.module.css';

import { useEffect, useState } from 'react';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import useLogout from 'Hooks/useLogout';
import { completarPerfil, extraiMotivoErroAcesso, verificaDisponibilidadeApelido } from 'Funcionalidades/Acessos/acessos.api';
import { ConteudoForm } from 'Componentes/Elementos/ConteudoForm/ConteudoForm';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { ConteudoTermoAceite } from 'Componentes/ElementosDeJogo/ModalPrimeiroAcesso/page';

type EstadoApelido = { situacao: 'VAZIO' | 'CONSULTANDO' | 'DISPONIVEL' | 'INDISPONIVEL'; motivo: string | null };

const ATRASO_CONSULTA_MS = 500;

/** Etapa obrigatória após a verificação do email: escolher o apelido definitivo (com consulta de disponibilidade em tempo real) e aceitar os Termos. Trava a navegação até concluir — conta sem apelido e sem aceite não circula na plataforma. */
export default function CompletarPerfil() {
    const { checkAuth, apelidoDefinido } = useContextoAutenticacao();
    const { logout } = useLogout();
    const [apelido, setApelido] = useState('');
    const [estadoApelido, setEstadoApelido] = useState<EstadoApelido>({ situacao: 'VAZIO', motivo: null });
    const [mostrarTermos, setMostrarTermos] = useState(false);
    const [checkTopicosSensiveis, setCheckTopicosSensiveis] = useState(false);
    const [termo1, setTermo1] = useState(false);
    const [termo2, setTermo2] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erroPerfil, setErroPerfil] = useState<string | null>(null);

    const termosAceitos = termo1 && termo2;

    // Consulta com atraso: a cada pausa na digitação, uma checagem — evita uma requisição por tecla e mantém a resposta imediata para quem já parou de digitar.
    useEffect(() => {
        if (apelidoDefinido) return;
        if (apelido.trim() === '') { setEstadoApelido({ situacao: 'VAZIO', motivo: null }); return; }

        setEstadoApelido({ situacao: 'CONSULTANDO', motivo: null });

        const temporizador = window.setTimeout(() => {
            void verificaDisponibilidadeApelido(apelido)
                .then(resposta => setEstadoApelido(resposta.disponivel ? { situacao: 'DISPONIVEL', motivo: null } : { situacao: 'INDISPONIVEL', motivo: resposta.motivo ?? 'Apelido indisponível' }))
                .catch(() => setEstadoApelido({ situacao: 'VAZIO', motivo: null }));
        }, ATRASO_CONSULTA_MS);

        return () => window.clearTimeout(temporizador);
    }, [apelido, apelidoDefinido]);

    const podeConcluir = termosAceitos && !salvando && (apelidoDefinido || estadoApelido.situacao === 'DISPONIVEL');

    async function aoConcluir(): Promise<void> {
        setErroPerfil(null);
        setSalvando(true);

        try {
            await completarPerfil(apelido, termosAceitos);
            await checkAuth();
        } catch (erroCapturado) {
            setErroPerfil(extraiMotivoErroAcesso(erroCapturado instanceof Error ? erroCapturado : null, 'Não foi possível concluir'));
        } finally {
            setSalvando(false);
        }
    };

    if (mostrarTermos) {
        return (
            <div className={styles.telaPerfil}>
                <div className={styles.areaTermos}>
                    <h1>Termos de Aceite</h1>
                    <div className={styles.corpoTermos}>
                        <ConteudoTermoAceite checkTopicosSensiveis={checkTopicosSensiveis} termo1={termo1} termo2={termo2} setCheckTopicosSensiveis={setCheckTopicosSensiveis} setTermo1={setTermo1} setTermo2={setTermo2} onVoltar={() => setMostrarTermos(false)} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.telaPerfil}>
            <div className={styles.areaPerfil}>
                <h1>{apelidoDefinido ? 'Aceite os Termos' : 'Escolha seu Apelido'}</h1>

                <ConteudoForm>
                    <ConteudoForm.AreaCorpo>
                        <div className={styles.camposPerfil}>
                            {!apelidoDefinido && (
                                <>
                                    <span className={styles.explicacao}>Este será o nome que identifica você por trás de tantos personagens. Não é o nome de um personagem e não poderá ser alterado depois</span>

                                    <InputComRotulo rotulo={'Apelido'}>
                                        <input type="text" value={apelido} maxLength={25} onChange={evento => setApelido(evento.target.value)} />
                                    </InputComRotulo>

                                    {estadoApelido.situacao === 'CONSULTANDO' && <span className={styles.textoNeutro}>Verificando disponibilidade…</span>}
                                    {estadoApelido.situacao === 'DISPONIVEL' && <span className={styles.apelidoLivre}>Apelido disponível</span>}
                                    {estadoApelido.situacao === 'INDISPONIVEL' && <span className={styles.erroPerfil}>{estadoApelido.motivo}</span>}
                                </>
                            )}

                            <span className={`${styles.linkTermos} ${!termosAceitos ? styles.pendente : ''}`} onClick={() => setMostrarTermos(true)}>{termosAceitos ? 'Termos de Aceite aceitos' : 'Ler e aceitar os Termos de Aceite'}</span>

                            {erroPerfil && <span className={styles.erroPerfil}>{erroPerfil}</span>}
                        </div>
                    </ConteudoForm.AreaCorpo>

                    <ConteudoForm.AreaBotoes>
                        <button onClick={() => { void aoConcluir(); }} disabled={!podeConcluir}>{salvando ? 'Concluindo…' : 'Concluir'}</button>
                    </ConteudoForm.AreaBotoes>
                </ConteudoForm>

                {/* Saída obrigatória: a etapa tranca a navegação, então sem isto quem não quer concluir agora fica preso na tela, sem voltar para a parte pública do site. */}
                <span className={styles.linkSair} onClick={logout}>Sair</span>
            </div>
        </div>
    );
};