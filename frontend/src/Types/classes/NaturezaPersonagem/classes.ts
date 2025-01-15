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
        new Acao({ nome: 'Sacar Item', idTipoAcao: 1 }, {}, { idExecucaoCustomizada: 1 }),
    ];
}


// new HabilidadeAtiva('Sacar Item', 'Você Empunha um Item que está em seu Inventário em suas Extremidades Livres', new RequisitoFicha((personagem: Personagem) => {
//     return personagem.estatisticasBuffaveis.extremidades.length > 0 && personagem.inventario.items.some(item => item.itemEmpunhavel)
// })).adicionarAcoes([
//     {
//         props: [],
//         config: (acao) => {
//             acao.adicionarCustos([
//                 classeComArgumentos(CustoExecucao, 3, 1)
//             ]);
//             acao.adicionarRequisitosEOpcoesPorId([3, 4]);
//         }
//     },
// ]),
// new HabilidadeAtiva('Guardar Item', 'Você Guarda um Item que está em suas Extremidades em seu Inventário', new RequisitoFicha((personagem: Personagem) => {
//     return personagem.estatisticasBuffaveis.extremidades.length > 0 && personagem.inventario.items.some(item => item.itemEmpunhavel)
// })).adicionarAcoes([
//     {
//         props: [{ nome: 'Guardar Item', idTipoAcao: 1, idMecanica: 2 }, {}],
//         config: (acao) => {
//             acao.adicionarCustos([
//                 classeComArgumentos(CustoExecucao, 3, 1)
//             ]);
//             acao.adicionarRequisitosEOpcoesPorId([5]);
//         }
//     },
// ]),
// new HabilidadeAtiva('Vestir Item', 'Você Veste um Item que está em suas Extremidades', new RequisitoFicha((personagem: Personagem) => {
//     return personagem.inventario.items.some(item => item.itemVestivel)
// })).adicionarAcoes([
//     {
//         props: [{ nome: 'Vestir Item', idTipoAcao: 1, idMecanica: 4 }, {}],
//         config: (acao) => {
//             acao.adicionarCustos([
//                 classeComArgumentos(CustoExecucao, 2, 1)
//             ]);
//             acao.adicionarRequisitosEOpcoesPorId([6]);
//         }
//     },
// ]),
// new HabilidadeAtiva('Desvestir Item', 'Você Desveste um Item e Empunha em suas Extremidades Livres', new RequisitoFicha((personagem: Personagem) => {
//     return personagem.inventario.items.some(item => item.itemVestivel)
// })).adicionarAcoes([
//     {
//         props: [{ nome: 'Desvestir Item', idTipoAcao: 1, idMecanica: 5 }, {}],
//         config: (acao) => {
//             acao.adicionarCustos([
//                 classeComArgumentos(CustoExecucao, 2, 1)
//             ]);
//             acao.adicionarRequisitosEOpcoesPorId([3, 7]);
//         }
//     },
// ]),
