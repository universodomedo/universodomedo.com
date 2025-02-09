// #region Imports
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';
import { useState, useRef, useEffect } from 'react';

import { Acao, executaAcao } from 'Classes/ClassesTipos/index.ts';
import { useContextoControleAcoes } from 'Contextos/ContextoControleAcoes/contexto.tsx'

import Modal from 'Componentes/ModalDialog/pagina';
import RecipienteDeAbas from 'Componentes/RecipienteDeAbas/pagina.tsx';
// #endregion

const page = ({ acao }: { acao: Acao }) => {
    const [openModal, setOpenModal] = useState(false);

    const { mostrarEtiquetas } = useContextoControleAcoes();

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

export default page;

const Icone = ({ acao, mostrarEtiquetas }: { acao: Acao, mostrarEtiquetas: boolean }) => {
    return (
        <div className={style.embrulho_icone}>
            {mostrarEtiquetas && (<h3>{acao.nome}</h3>)}
            <div className={`${style.icone}`} style={{ backgroundImage: `url(data:image/svg+xml;base64,${acao.svg})`, backgroundColor: (acao.bloqueada ? '#BB0000' : '#FFFFFF') }} />
        </div>
    );
}

const BlocoTexto = ({ lista, titulo, corTexto, descricao }: { lista: any[]; titulo: string; corTexto: (item: any) => string; descricao: (item: any) => string; }) => {
    if (lista.length === 0) return null;

    return (
        <div className={style.bloco_texto}>
            <p className={style.titulo}>{titulo}</p>
            {lista.map((item, index) => (
                <p key={index} style={{ color: corTexto(item) }} className={style.texto}>
                    {descricao(item)}
                </p>
            ))}
        </div>
    );
}

// const ConteudoExecucaoGenerico = () => {
//     if (acao.dadosAcaoCustomizada !== undefined) return (<ConteudoAcaoNaturezaParaItem fechaModal={fechaModal} />)
//     else return (<ConteudoExecucao fechaModal={fechaModal} />)
// }

const ConteudoExecucao = ({ acao, fecharModal }: { acao: Acao, fecharModal: () => void }) => {
    // const [valoresSelecionados, setValoresSelecionados] = useState<GastaCustoProps>({});
    // const firstSelectRef = useRef<HTMLSelectElement | null>(null);
    // const buttonRef = useRef<HTMLButtonElement | null>(null);

    // const handleSelectChange = (key: string, value: number) => {
    //     setValoresSelecionados((prevState) => ({
    //         ...prevState,
    //         [key]: value,
    //     }));
    // };

    // useEffect(() => {
    //     if (firstSelectRef.current) firstSelectRef.current.focus();
    // }, []);

    // const handleKeyPress = (event: React.KeyboardEvent<HTMLSelectElement>) => {
    //     if (event.key === "Enter") {
    //         event.preventDefault();
    //         buttonRef.current?.click();
    //     }
    // };

    // return (
    //     <>
    //         <div className={style.recipiente_conteudo_execucao_modal}>
    //             {acao.opcoesExecucoes.length > 0 && acao.opcoesExecucoes.map((opcoesExecucao, index) => {
    //                 const key = opcoesExecucao.key;

    //                 return (
    //                     <div key={key} className={style.opcao_acao}>
    //                         <h2>{opcoesExecucao.displayName}</h2>
    //                         <select ref={index === 0 ? firstSelectRef : null} value={valoresSelecionados[key] || 0} onChange={(e) => handleSelectChange(key, Number(e.target.value))} onKeyDown={handleKeyPress}>
    //                             <option value="0" className={style.opcao_acao_padrao} disabled>Selecione a Opção...</option>
    //                             {opcoesExecucao.opcoes.map(opcao => (
    //                                 <option key={opcao.key} value={opcao.key} disabled={opcao.disabled}>{opcao.value}</option>
    //                             ))}
    //                         </select>
    //                     </div>
    //                 );
    //             })}
    //         </div>
    //         <button
    //             ref={buttonRef}
    //             className={style.botao_principal}
    //             onClick={() => { acao.executaComOpcoes(valoresSelecionados); fecharModal(); }}
    //             disabled={acao.opcoesExecucoes.length != Object.keys(valoresSelecionados).length}
    //         >
    //             Executar
    //         </button>
    //     </>
    // );

    return (<><button onClick={() => { executaAcao(acao); }}>Teste</button></>);
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

// const ConteudoAcaoNaturezaParaItem = ({ fechaModal }: { fechaModal: () => void }) => {
//     const [indexItemSelecionado, setIndexItemSelecionado] = useState<number | undefined>(undefined);
//     const listaItems = getPersonagemFromContext().inventario.items.filter(item => acao.dadosAcaoCustomizada!.condicaoListaItems(item));
//     const itemSelecionado = indexItemSelecionado !== undefined
//         ? listaItems.find(item => item.id === indexItemSelecionado)
//         : undefined;

//     const handleSelectChange = (value: number) => {
//         setIndexItemSelecionado(value);
//     };

//     const handleKeyPress = (event: React.KeyboardEvent<HTMLSelectElement>) => {
//         if (event.key === "Enter") {
//             event.preventDefault();
//         }
//     };

//     const executar = () => {
//         acao.dadosAcaoCustomizada?.executarAcaoItem(itemSelecionado!);
//         setOpenModal(false);
//         fechaModal();
//     }

//     return (
//         <>
//             <div className={style.opcao_acao}>
//                 <select value={indexItemSelecionado || 0} onChange={(e) => handleSelectChange(Number(e.target.value))} onKeyDown={handleKeyPress}>
//                     <option value="0" className={style.opcao_acao_padrao} disabled>Selecione o Item...</option>
//                     {listaItems.map(item => (
//                         <option key={item.id} value={item.id}>{item.nomeExibicao}</option>
//                     ))}
//                 </select>
//             </div>

//             {itemSelecionado !== undefined && (
//                 <>
//                     <div className={style.bloco_texto}>
//                         <p className={`${style.texto} ${itemSelecionado.comportamentos.comportamentoEmpunhavel.execucoesSuficientes ? '' : style.mensagem_erro}`}>Custo para Sacar: {itemSelecionado.comportamentos.comportamentoEmpunhavel.precoParaSacarOuGuardar.descricaoCusto}</p>
//                         <p className={`${style.texto} ${itemSelecionado.comportamentos.comportamentoEmpunhavel.extremidadeLivresSuficiente ? '' : style.mensagem_erro}`}>Extremidade para Empunhar: {itemSelecionado.comportamentos.comportamentoEmpunhavel.extremidadesNecessarias}</p>
//                     </div>

//                     {itemSelecionado.comportamentos.custosParaSacarValidos &&
//                         <div className={style.bloco_texto}>
//                             <p className={style.texto}>Vai Gastar {itemSelecionado.comportamentos.mensagemExecucoesUsadasParaSacar}</p>
//                         </div>
//                     }
//                 </>
//             )}

//             <button
//                 className={style.botao_principal}
//                 onClick={executar}
//                 disabled={itemSelecionado === undefined || !itemSelecionado.comportamentos.custosParaSacarValidos}
//             >
//                 Executar
//             </button>
//         </>
//     );
// }