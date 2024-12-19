// #region Imports
import { Acao, Buff, classeComArgumentos, CustoPE, CustoExecucao, CustoComponente, dadosItem, Item, NomeItem, RLJ_Ficha2 } from 'Types/classes/index.ts';
// #endregion

// quando o objeto estiver sendo adicionado pelo shopping ou no meio de sessao, deve ser enviado com adicionaDados
export function novoItemPorDadosItem(dadosItem: dadosItem, adicionaDados: boolean = false): Item {
    if (adicionaDados) {
        // manda pro localStorage
        // logica temporaria, depois tem que enviar pro banco de dados
        const dadosFicha = localStorage.getItem('dadosFicha');

        if (dadosFicha) {
            const fichas: RLJ_Ficha2[] = JSON.parse(dadosFicha);
            const fichaAtualizada = fichas[0] || { inventario: [] };

            fichaAtualizada.inventario.push(dadosItem);
            fichas[0] = fichaAtualizada;
            localStorage.setItem('dadosFicha', JSON.stringify(fichas));
        }
    }

    return new Item(dadosItem.idTipoItem, new NomeItem(dadosItem.nomeItem.nomePadrao, dadosItem.nomeItem.nomeCustomizado || ''), dadosItem.peso, dadosItem.categoria, dadosItem.detalhesItem || {}, dadosItem.detalhesConsumiveis?.usosMaximos)
        .adicionarAcoes(
            (dadosItem.dadosAcoes || []).map(dadosAcao => [
                ...classeComArgumentos(Acao, dadosAcao.nomeAcao, dadosAcao.idTipoAcao, dadosAcao.idCategoriaAcao, dadosAcao.idMecanica),
                (acao) => {
                    acao.adicionarCustos([
                        dadosAcao.custos.custoPE?.valor ? classeComArgumentos(CustoPE, dadosAcao.custos.custoPE.valor) : null!,
                        ...((dadosAcao.custos.custoExecucao || []).map(execucao =>
                            execucao.valor ? classeComArgumentos(CustoExecucao, execucao.idExecucao, execucao.valor) : null!
                        )),
                        dadosAcao.custos.custoComponente ? classeComArgumentos(CustoComponente) : null!
                    ].filter(Boolean));
                    acao.adicionarBuffs(
                        (dadosAcao.buffs || []).map(buff => [
                            ...classeComArgumentos(Buff, buff.idBuff, buff.nome, buff.valor, buff.duracao.idDuracao, buff.duracao.valor, buff.idTipoBuff)
                        ])
                    );
                    acao.adicionarRequisitosEOpcoesPorId(dadosAcao.requisitos);
                }
            ])
        )
        .adicionarBuffs(
            (dadosItem.buffs || []).map(buff => [
                ...classeComArgumentos(Buff, buff.idBuff, buff.nome, buff.valor, buff.duracao.idDuracao, buff.duracao.valor, buff.idTipoBuff)
            ])
        );
}