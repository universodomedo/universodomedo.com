// // #region Imports
// import { Acao, GastaCustoProps } from 'Classes/ClassesTipos/index.ts';

// import { getPersonagemFromContext } from 'Contextos/ContextoPersonagem/contexto.tsx';
// import { ExecutaVariacaoGenerica } from 'Recursos/Ficha/Variacao.ts';
// import { ExecutaTestePericiaGenerico } from 'Recursos/Ficha/Procedimentos.ts';

// import { LoggerHelper } from 'Classes/classes_estaticas.ts';
// import { toast } from 'react-toastify';
// // #endregion

// export class Mecanica {
//     constructor(
//         public id: number,
//         public descricao: string,
//     ) { }
// }

// export const logicaMecanicas: { [key: number]: (valoresSelecionados: GastaCustoProps, acao: Acao) => void } = {
//     // Sacar
//     1: (valoresSelecionados) => {
//         const itemSelecionado = getPersonagemFromContext().inventario.items.find(item => item.id === valoresSelecionados['idItem']);

//         itemSelecionado?.sacar();
//     },

//     // Guardar
//     2: (valoresSelecionados) => {
//         const itemSelecionado = getPersonagemFromContext().inventario.items.find(item => item.id === valoresSelecionados['idItem']);

//         itemSelecionado?.guardar();
//     },

//     // Aplicar Buff
//     3: (valoresSelecionados, acao) => {
//         acao.ativaBuffs();
//     },

//     // Vestir
//     4: (valoresSelecionados) => {
//         const itemSelecionado = getPersonagemFromContext().inventario.items.find(item => item.id === valoresSelecionados['idItem']);

//         itemSelecionado?.vestir();
//     },

//     // Desvestir
//     5: (valoresSelecionados) => {
//         const itemSelecionado = getPersonagemFromContext().inventario.items.find(item => item.id === valoresSelecionados['idItem']);

//         itemSelecionado?.desvestir();
//     },

//     // Realizar Ataque/Cura
//     6: (valoresSelecionados, acao) => {
//         // const alvoSelecionado = valoresSelecionados['alvo']

//         const resultadoVariacao = ExecutaVariacaoGenerica({ listaVarianciasDaAcao: [{ valorMaximo: acao.comportamentos.comportamentoAcao.valorGenerico.valorMax, variancia: acao.comportamentos.comportamentoAcao.valorGenerico.variancia }] })

//         const valor = resultadoVariacao.reduce((cur, acc) => { return cur + acc.valorFinal }, 0);

//         let resumo = '';
//         if (acao.comportamentos.comportamentoAcao.tipo === 'Dano') {
//             resumo = `${valor} de dano`;
//         } else {
//             resumo = `Recupera ${valor} P.V.`;
//         }

//         // LoggerHelper.getInstance().adicionaMensagem(resumo);
//         toast(resumo);

//         resultadoVariacao.map(variacao => {
//             LoggerHelper.getInstance().adicionaMensagem(`Dano de ${variacao.varianciaDaAcao.valorMaximo - variacao.varianciaDaAcao.variancia} a ${variacao.varianciaDaAcao.valorMaximo}: ${variacao.valorFinal}`, true);
//             LoggerHelper.getInstance().adicionaMensagem(`Aproveitamento de ${variacao.variacaoAleatoria.sucessoDessaVariancia}%`);
//             LoggerHelper.getInstance().fechaNivelLogMensagem();
//         });
//     }
// };