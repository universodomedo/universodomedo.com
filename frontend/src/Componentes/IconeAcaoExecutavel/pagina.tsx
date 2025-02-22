// #region Imports
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';
import { useState, useRef, useEffect } from 'react';

import { Acao, ehAcaoEspecifica, ehAcaoGenerica, OpcoesSelecionadasExecucaoAcao } from 'Classes/ClassesTipos/index.ts';

import Modal from 'Componentes/ModalDialog/pagina';
import RecipienteDeAbas from 'Componentes/RecipienteDeAbas/pagina.tsx';
// #endregion

const pagina = ({ acao, mostrarEtiquetas = false }: { acao: Acao, mostrarEtiquetas?: boolean }) => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <Modal open={openModal} onOpenChange={setOpenModal}>
            <Modal.Button>
                <Icone acao={acao} mostrarEtiquetas={mostrarEtiquetas} />
            </Modal.Button>

            <Modal.Content title={`Executando ${acao.nome}`}>
                <RecipienteDeAbas codigoAbaDefault='abaExecucao'>
                    <RecipienteDeAbas.Aba>
                        <RecipienteDeAbas.Gatilho titulo='Detalhamento' codigo='abaDetalhamento' />
                        <RecipienteDeAbas.Gatilho titulo='Execução' codigo='abaExecucao' />
                    </RecipienteDeAbas.Aba>
                    <RecipienteDeAbas.ConteudoAba codigo='abaDetalhamento'><ConteudoDetalhes acao={acao} /></RecipienteDeAbas.ConteudoAba>
                    <RecipienteDeAbas.ConteudoAba codigo='abaExecucao'><ConteudoExecucao acao={acao} fecharModal={() => setOpenModal(false)} /></RecipienteDeAbas.ConteudoAba>
                </RecipienteDeAbas>
            </Modal.Content>
        </Modal>
    );
}

const Icone = ({ acao, mostrarEtiquetas }: { acao: Acao, mostrarEtiquetas: boolean }) => {
    return (
        <div className={style.embrulho_icone}>
            {mostrarEtiquetas && (<h3>{acao.nome}</h3>)}
            <div className={`${style.icone}`} style={{ backgroundImage: `url(data:image/svg+xml;base64,${acao.svg})`, backgroundColor: (acao.bloqueada ? '#BB0000' : '#FFFFFF') }} />
        </div>
    );
};

const ConteudoExecucao = ({ acao, fecharModal }: { acao: Acao, fecharModal: () => void }) => {
    const [opcoesSelecionadas, setOpcoesSelecionadas] = useState<OpcoesSelecionadasExecucaoAcao>({});
    const firstSelectRef = useRef<HTMLSelectElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const handleSelectChange = (identificador: string, value: string) => {
        setOpcoesSelecionadas((prevState) => ({
            ...prevState,
            [identificador]: value,
        }));
    };

    useEffect(() => {
        if (firstSelectRef.current) firstSelectRef.current.focus();
    }, []);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLSelectElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            buttonRef.current?.click();
        }
    };

    if (ehAcaoGenerica(acao)) {
        return (
            <>
                <div className={style.recipiente_conteudo_execucao_modal}>
                    {!acao.bloqueada && acao.opcoesExecucaoAcao.length > 0 && (
                        <>
                            {acao.opcoesExecucaoAcao.map((opcoesExecucao, index) => {
                                return (
                                    <div key={index} className={style.opcao_acao}>
                                        <h2>{opcoesExecucao.nomeExibicao}</h2>
                                        <select ref={index === 0 ? firstSelectRef : null} value={opcoesSelecionadas[opcoesExecucao.identificador] || 0} onChange={(e) => handleSelectChange(opcoesExecucao.identificador, e.target.value)} onKeyDown={handleKeyPress}>
                                            <option value="0" className={style.opcao_acao_padrao} disabled>Selecione a Opção...</option>
                                            {opcoesExecucao.opcoes.map(opcao => (
                                                <option key={opcao.key} value={opcao.key} disabled={opcao.disabled}>{opcao.value}</option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            })}

                            <hr />
                        </>
                    )}

                    {acao.travada && (
                        <div className={style.bloco_texto}>
                            <p className={`${style.titulo} cor_mensagem_erro`}>Ação Travada pelo Turno</p>
                            <p className={`${style.texto} cor_mensagem_erro`}>{acao.descricaoTravada}</p>
                        </div>
                    )}
                    {acao.requisitosParaExecutarAcao.listaValidacaoRequisitos.length > 0 && (
                        <div className={style.bloco_texto}>
                            <p className={style.titulo}>Requisitos</p>
                            {acao.requisitosParaExecutarAcao.listaValidacaoRequisitos.map((requisito, index) => (
                                <p key={index} className={`${style.texto} ${!requisito.estaValido ? 'cor_mensagem_erro' : ''}`}>{requisito.descricaoRequisito}</p>
                            ))}
                        </div>
                    )}
                    {acao.dificuldadeAcao && (
                        <div className={style.bloco_texto}>
                            <p className={style.titulo}>Dificuldade de Execução</p>
                            <p className={style.texto}>{acao.dificuldadeAcao.refAtributoPersonagem.refAtributo.nomeAbreviado} {acao.dificuldadeAcao.refPericiaPatentePersonagem.refPericia.nomeAbreviado} DT {acao.dificuldadeAcao.checagemDificuldade.valorChecagemDificuldade}</p>
                        </div>
                    )}
                    {acao.custos.listaCustos.length > 0 && (
                        <div className={style.bloco_texto}>
                            <p className={style.titulo}>Custos</p>
                            {
                                acao.custos.custoAcaoExecucao.podeSerPago
                                    ? (<p className={style.texto}>{acao.custos.custoAcaoExecucao.resumoPagamento}</p>)
                                    : (<p className={`${style.texto} ${!acao.custos.custoAcaoExecucao.podeSerPago ? 'cor_mensagem_erro' : ''}`}>{acao.custos.custoAcaoExecucao.descricaoListaPreco}</p>)
                            }

                            {acao.custos.custoAcaoPE && (<p className={`${style.texto} ${!acao.custos.custoAcaoPE.podeSerPago ? 'cor_mensagem_erro' : ''}`}>{acao.custos.custoAcaoPE.valor} P.E.</p>)}

                            {acao.custos.custoAcaoComponente && (<p className={`${style.texto} ${!acao.custos.custoAcaoComponente.podeSerPago ? 'cor_mensagem_erro' : ''}`}>{acao.custos.custoAcaoComponente.numeroCargasNoUso} Carga de Componente de {acao.custos.custoAcaoComponente.refElemento.nome} {acao.custos.custoAcaoComponente.refNivelComponente.nome}{acao.custos.custoAcaoComponente.precisaEstarEmpunhado ? ' Empunhado' : ''}</p>)}
                        </div>
                    )}
                </div>

                {!acao.bloqueada && (
                    <button
                        ref={buttonRef}
                        className={style.botao_principal}
                        disabled={acao.opcoesExecucaoAcao.length != Object.keys(opcoesSelecionadas).length}
                        onClick={() => { acao.executaAcao(opcoesSelecionadas); fecharModal(); }}>
                            Executar
                    </button>
                )}
            </>
        );
    } else if (ehAcaoEspecifica(acao)) {
        return (
            <>
                {acao.dadosCarregadosPreviamente}
                
                <div className={style.recipiente_conteudo_execucao_modal}>
                    {!acao.bloqueada && acao.opcoesExecucaoAcao.length > 0 && (
                        <>
                            {acao.opcoesExecucaoAcao.map((opcoesExecucao, index) => {
                                return (
                                    <div key={index} className={style.opcao_acao}>
                                        <h2>{opcoesExecucao.nomeExibicao}</h2>
                                        <select ref={index === 0 ? firstSelectRef : null} value={opcoesSelecionadas[opcoesExecucao.identificador] || 0} onChange={(e) => handleSelectChange(opcoesExecucao.identificador, e.target.value)} onKeyDown={handleKeyPress}>
                                            <option value="0" className={style.opcao_acao_padrao} disabled>Selecione a Opção...</option>
                                            {opcoesExecucao.opcoes.map(opcao => (
                                                <option key={opcao.key} value={opcao.key} disabled={opcao.disabled}>{opcao.value}</option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            })}

                            <hr />
                        </>
                    )}

                    {acao.dadosCarregadosNoChangeOption(opcoesSelecionadas)}
                </div>
                
                {!acao.bloqueada && (
                    <button
                        ref={buttonRef}
                        className={style.botao_principal}
                        disabled={!acao.validaExecucao(opcoesSelecionadas)}
                        onClick={() => { acao.executarAcaoEspecifica(opcoesSelecionadas); fecharModal(); }}>
                            Executar
                    </button>
                )}
            </>
        )
    }
}

const ConteudoDetalhes = ({ acao }: { acao: Acao }) => {
    // const textoDano = acao.comportamentos.temComportamentoAcao
    //     ? `${acao.comportamentos.comportamentoAcao.valorGenerico.valorMin} a ${acao.comportamentos.comportamentoAcao.valorGenerico.valorMax} de ${acao.comportamentos.comportamentoAcao.tipo}`
    //     : '';

    // const textoTestePericia = acao.comportamentos.comportamentoDificuldadeAcao
    //     ? `Depende de um Teste de ${acao.comportamentos.comportamentoDificuldadeAcao.refPericia.nomeAbrev} com ${acao.comportamentos.comportamentoDificuldadeAcao.refAtributo.nomeAbrev}`
    //     : '';

    // return (
    //     <>
    //         {(textoDano || textoTestePericia) && (
    //             <div className={style.bloco_texto}>
    //                 {textoDano && (<p className={style.texto}>{textoDano}</p>)}
    //                 {textoTestePericia && (<p className={style.texto}>{textoTestePericia}</p>)}
    //             </div>
    //         )}
    //         <BlocoTexto lista={acao.comportamentos.listaCustos} titulo={'Custos'} corTexto={custo => !custo.podeSerPago ? '#FF0000' : ''} descricao={custo => custo.descricaoCusto} />
    //         {/* <BlocoTexto lista={acao.requisitos} titulo={'Requisitos'} corTexto={requisito => !requisito.requisitoCumprido ? '#FF0000' : ''} descricao={requisito => requisito.descricaoRequisito} /> */}
    //         {/* <BlocoTexto lista={acao.dificuldades} titulo={'Dificuldades'} corTexto={dificuldade => false ? '#FF0000' : '#F49A34'} descricao={custo => custo.descricaoDificuldade} /> */}
    //         {acao.comportamentos.acaoTravada && (
    //             <div className={style.bloco_texto}>
    //                 <p className={style.texto}>{acao.comportamentos.comportamentoTrava.descricaoTrava}</p>
    //             </div>
    //         )}
    //     </>
    // );
    return (<></>);
}

export default pagina;