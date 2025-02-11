// #region Imports
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';
import { useState, useRef, useEffect } from 'react';

import { Acao, executaAcao } from 'Classes/ClassesTipos/index.ts';

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
}

const ConteudoExecucao = ({ acao, fecharModal }: { acao: Acao, fecharModal: () => void }) => {
    // const [valoresSelecionados, setValoresSelecionados] = useState<GastaCustoProps>({});
    const firstSelectRef = useRef<HTMLSelectElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    // const handleSelectChange = (key: string, value: number) => {
    //     setValoresSelecionados((prevState) => ({
    //         ...prevState,
    //         [key]: value,
    //     }));
    // };

    useEffect(() => {
        if (firstSelectRef.current) firstSelectRef.current.focus();
    }, []);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLSelectElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            buttonRef.current?.click();
        }
    };

    console.log('------------------------------------');
    
    console.log(acao);
    console.log(acao.custos);
    console.log(acao.custos.custoAcaoPE);
    console.log(acao.custos.custoAcaoPE?.podeSerPago);
    
    console.log('------------------------------------');

    return (
        <>
            <div className={style.recipiente_conteudo_execucao_modal}>
                {/* {acao.opcoesExecucoes.length > 0 && acao.opcoesExecucoes.map((opcoesExecucao, index) => {
                    const key = opcoesExecucao.key;

                    return (
                        <div key={key} className={style.opcao_acao}>
                            <h2>{opcoesExecucao.displayName}</h2>
                            <select ref={index === 0 ? firstSelectRef : null} value={valoresSelecionados[key] || 0} onChange={(e) => handleSelectChange(key, Number(e.target.value))} onKeyDown={handleKeyPress}>
                                <option value="0" className={style.opcao_acao_padrao} disabled>Selecione a Opção...</option>
                                {opcoesExecucao.opcoes.map(opcao => (
                                    <option key={opcao.key} value={opcao.key} disabled={opcao.disabled}>{opcao.value}</option>
                                ))}
                            </select>
                        </div>
                    );
                })} */}
                {acao.travada && (
                    <div className={style.bloco_texto}>
                        <p className={`${style.titulo} cor_mensagem_erro`}>Ação Travada pelo Turno</p>
                        <p className={`${style.texto} cor_mensagem_erro`}>{acao.descricaoTravada}</p>
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
                        <p className={`${style.texto} ${!acao.custos.custoAcaoExecucao.podeSerPago ? 'cor_mensagem_erro' : ''}`}>{acao.custos.custoAcaoExecucao.resumoPagamento}</p>
                        {acao.custos.custoAcaoPE && (<p className={`${style.texto} ${!acao.custos.custoAcaoPE.podeSerPago ? 'cor_mensagem_erro' : ''}`}>{acao.custos.custoAcaoPE.valor} P.E.</p>)}
                    </div>
                )}
            </div>
            <button ref={buttonRef} className={style.botao_principal} onClick={() => { executaAcao(acao); fecharModal(); }}>Executar</button>
        </>
    );

    // return (<><button onClick={() => { executaAcao(acao); }}>Teste</button></>);
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