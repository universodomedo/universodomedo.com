// #region Imports
import { Acao, Buff, classeComArgumentos, CustoPE, CustoExecucao, CustoComponente, dadosItem, Item, NomeItem, RLJ_Ficha2, DetalhesComponente, DetalhesOfensivo } from 'Types/classes/index.ts';
import { getIdFichaNoLocalStorageFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto';
// #endregion

// quando o objeto estiver sendo adicionado pelo shopping ou no meio de sessao, deve ser enviado com adicionaDados
export function novoItemPorDadosItem(dadosItem: dadosItem, adicionaDados: boolean = false): Item {
    if (adicionaDados) {
        const idFichaNoLocalStorage = getIdFichaNoLocalStorageFromContext();

        // manda pro localStorage
        // logica temporaria, depois tem que enviar pro banco de dados
        const dadosFicha = localStorage.getItem('dadosFicha');

        if (dadosFicha) {
            const fichas: RLJ_Ficha2[] = JSON.parse(dadosFicha);
            const fichaAtualizada = fichas[idFichaNoLocalStorage] || { inventario: [] };

            fichaAtualizada.inventario.push(dadosItem);
            fichas[idFichaNoLocalStorage] = fichaAtualizada;
            localStorage.setItem('dadosFicha', JSON.stringify(fichas));
        }
    }

    if (dadosItem.detalhesComponente !== undefined) {
        if (dadosItem.detalhesItem === undefined) {
            dadosItem.detalhesItem = { detalhesComponente: new DetalhesComponente(dadosItem.detalhesComponente.idElemento, dadosItem.detalhesComponente.idNivelComponente) };
        } else {
            dadosItem.detalhesItem.detalhesComponente = new DetalhesComponente(dadosItem.detalhesComponente.idElemento, dadosItem.detalhesComponente.idNivelComponente);
        }
    }

    if (dadosItem.detalhesArma !== undefined) {
        if (dadosItem.detalhesItem === undefined) {
            dadosItem.detalhesItem = { detalhesOfensivo: new DetalhesOfensivo(dadosItem.detalhesArma.danoMin, dadosItem.detalhesArma.danoMax, dadosItem.detalhesArma.idAtributoUtilizado, dadosItem.detalhesArma.idPericiaUtilizada) };
        } else {
            dadosItem.detalhesItem.detalhesOfensivo = new DetalhesOfensivo(dadosItem.detalhesArma.danoMin, dadosItem.detalhesArma.danoMax, dadosItem.detalhesArma.idAtributoUtilizado, dadosItem.detalhesArma.idPericiaUtilizada);
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