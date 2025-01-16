// #region Imports
import { Acao } from 'Types/classes/index.ts';
// #endregion

export class NaturezaPersonagem {
    public acoes: Acao[] = lista_acoes_natureza();
}

export const lista_acoes_natureza = (): Acao[] => {
    return [
        new Acao({ nome: 'Deslocar', idTipoAcao: 1 }, { dadosComportamentoCustoAcao: { custoExecucao: { precoExecucao: { precos: [{ idTipoExecucao: 3, quantidadeExecucoes: 1 }] } } } }),
        new Acao({ nome: 'Ataque Desarmado', idTipoAcao: 1 }, { dadosComportamentoAcao: { tipo: 'Dano', paramsValorGenerico: { valorMin: 3 } }, dadosComportamentoCustoAcao: { custoExecucao: { precoExecucao: { precos: [{ idTipoExecucao: 2, quantidadeExecucoes: 1 }] } } }, dadosComportamentoDificuldadeAcao: { dadosTeste: { idAtributo: 2, idPericia: 8 }, } }),
        new Acao({ nome: 'Sacar Item', idTipoAcao: 1 }, {}, { condicaoListaItems: (item) => { return item.itemPodeSerSacado }, executarAcaoItem: (item) => { item.sacar() }}),
        new Acao({ nome: 'Guardar Item', idTipoAcao: 1 }, {}, { condicaoListaItems: (item) => { return item.itemPodeSerGuardado }, executarAcaoItem: (item) => { item.guardar() }}),
        new Acao({ nome: 'Vestir Item', idTipoAcao: 1 }, {}, { condicaoListaItems: (item) => { return item.itemPodeSerVestido }, executarAcaoItem: (item) => { item.vestir() }}),
        new Acao({ nome: 'Desvestir Item', idTipoAcao: 1 }, {}, { condicaoListaItems: (item) => { return item.itemPodeSerDesvestido }, executarAcaoItem: (item) => { item.desvestir() }}),
    ];
}