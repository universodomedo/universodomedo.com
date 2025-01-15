// #region Imports
import { classeComArgumentos, CustoPE, CustoExecucao, CustoComponente, ArgsItem, Item, RLJ_Ficha2 } from 'Types/classes/index.ts';
import { getIdFichaNoLocalStorageFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto';
// #endregion

// quando o objeto estiver sendo adicionado pelo shopping ou no meio de sessao, deve ser enviado com adicionaDados
export function novoItemPorDadosItem(argsItem: ArgsItem, adicionaDados: boolean = false): Item {
    if (adicionaDados) {
        const idFichaNoLocalStorage = getIdFichaNoLocalStorageFromContext();

        // manda pro localStorage
        // logica temporaria, depois tem que enviar pro banco de dados
        const dadosFicha = localStorage.getItem('dadosFicha');

        if (dadosFicha) {
            const fichas: RLJ_Ficha2[] = JSON.parse(dadosFicha);
            const fichaAtualizada = fichas[idFichaNoLocalStorage] || { inventario: [] };

            fichaAtualizada.inventario!.push(argsItem);
            fichas[idFichaNoLocalStorage] = fichaAtualizada;
            localStorage.setItem('dadosFicha', JSON.stringify(fichas));
        }
    }

    return new Item([argsItem.args], argsItem.dadosComportamentos)
        .adicionarAcoes(
            (argsItem.dadosAcoes || []).map(argsAcao => (
                {
                    props: [argsAcao.args, argsAcao.dadosComportamentos],
                    config: (acao) => {
                        // acao.adicionarCustos([
                        //     argsAcao.custos.custoPE?.valor ? classeComArgumentos(CustoPE, argsAcao.custos.custoPE.valor) : null!,
                        //     ...((argsAcao.custos.custoExecucao || []).map(execucao =>
                        //         execucao.valor ? classeComArgumentos(CustoExecucao, execucao.idExecucao, execucao.valor) : null!
                        //     )),
                        //     argsAcao.custos.custoComponente ? classeComArgumentos(CustoComponente) : null!
                        // ].filter(Boolean));
                        acao.adicionarModificadores(
                            (argsAcao.modificadores?.map(modificador => modificador.props) || [])
                        );

                        // logica temporaria para sempre que uma acao tiver comportamentoRequisito, incluir o RequisitoPericia
                        if (acao.comportamentos.temComportamentoRequisito && !argsAcao.requisitos.includes(8)) argsAcao.requisitos.push(8);
                        acao.adicionarRequisitosEOpcoesPorId(argsAcao.requisitos);
                    }
                }
            ))
        )
        .adicionarModificadores(
            (argsItem.modificadores?.map(modificador => modificador.props) || [])
        );
}