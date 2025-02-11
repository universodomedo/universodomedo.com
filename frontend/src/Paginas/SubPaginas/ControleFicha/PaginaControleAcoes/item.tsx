// #region Imports
import style from 'Recursos/EstilizacaoCompartilhada/detalhes_popover.module.css';

import { Acao } from 'Classes/ClassesTipos/index.ts';

import IconeAcaoExecutavel from 'Componentes/IconeAcaoExecutavel/pagina.tsx';

import { useContextoControleAcoes } from 'Contextos/ContextoControleAcoes/contexto.tsx';
// #endregion

const pagina = ({ acao }: { acao: Acao }) => {
    const { mostrarEtiquetas } = useContextoControleAcoes();

    return (
        <IconeAcaoExecutavel acao={acao} mostrarEtiquetas={mostrarEtiquetas} />
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

const BlocoTexto2 = () => {
    return (
        <div className={style.bloco_texto}>
            <p className={style.titulo}>Ação Travada</p>
            <p style={{ color: '#FF0000' }} className={style.texto}>Dificuldade não superada</p>
        </div>
    );
}

// const ConteudoExecucaoGenerico = () => {
//     if (acao.dadosAcaoCustomizada !== undefined) return (<ConteudoAcaoNaturezaParaItem fechaModal={fechaModal} />)
//     else return (<ConteudoExecucao fechaModal={fechaModal} />)
// }

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

export default pagina;