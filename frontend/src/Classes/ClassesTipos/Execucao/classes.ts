import { LinhaEfeito } from 'Classes/ClassesTipos/index.ts';

export type ExecucaoModelo = {
    id: number;
    idLinhaEfeito: number;
    nome: string;
};

export type Execucao = ExecucaoModelo & {
    readonly nomeExibicao: string;
    readonly refLinhaEfeito: LinhaEfeito;
};

export type ExecucaoPersonagem = {
    numeroAcoesMaximasNatural: number;
    numeroAcoesAtuais: number;
    readonly numeroAcoesMaximasTotal: number;
    readonly refExecucao: Execucao;

    recarregaNumeroAcoes: () => void;
};

export type DadosExecucaoPersonagem = Omit<ExecucaoPersonagem, 'refExecucao'> & {
    idExecucao: number;
};


// export interface IExecucao {
//     idTipoExecucao: number;
//     numeroAcoesMaximasNatural: number;
// }

// export interface IExecucaoService extends IExecucao {
//     numeroAcoesAtuais: number;
//     readonly numeroAcoesMaximasTotal: number;
//     recarregaNumeroAcoes(): void;
//     refTipoExecucao: TipoExecucao;
// }

// export class Execucao {
//     public numeroAcoesAtuais: number = 0;

//     constructor(
//         private _idTipoExecucao: number,
//         public numeroAcoesMaximas: number
//     ) { }

//     get refTipoExecucao(): TipoExecucao { return SingletonHelper.getInstance().tipos_execucao.find(tipo_execucao => tipo_execucao.id === this._idTipoExecucao)!; }
//     get valorTotal(): number { return getPersonagemFromContext().obtemValorTotalComLinhaEfeito(this.numeroAcoesMaximas, this.refTipoExecucao.refLinhaEfeito.id) };

//     recarregaNumeroAcoes(): void { this.numeroAcoesAtuais = this.valorTotal; }
// }

// export class TipoExecucao {
//     constructor(
//         public id: number,
//         private _idLinhaEfeito: number,
//         public nome: string,
//     ) { }

//     get nomeExibicao(): string { return `Ação ${this.nome}`; }
//     get refLinhaEfeito(): LinhaEfeito { return SingletonHelper.getInstance().linhas_efeito.find(linha_efeito => linha_efeito.id === this._idLinhaEfeito)!; }
// }

// export class PrecoTipoExecucao {
//     private _idTipoExecucao: number;
//     public quantidadeExecucoes: number;

//     constructor({ idTipoExecucao, quantidadeExecucoes }: { idTipoExecucao: number, quantidadeExecucoes: number, }) {
//         this._idTipoExecucao = idTipoExecucao;
//         this.quantidadeExecucoes = quantidadeExecucoes;
//     }

//     get refTipoExecucao(): TipoExecucao { return SingletonHelper.getInstance().tipos_execucao.find(tipo_execucao => tipo_execucao.id === this._idTipoExecucao)!; }
//     get descricaoPreco(): string { return this._idTipoExecucao === 1 ? `Ação ${this.refTipoExecucao.nome}` : `${this.quantidadeExecucoes} ${pluralize(this.quantidadeExecucoes, 'Ação', 'Ações')} ${this.refTipoExecucao.nome}`; }
// }

// export class PrecoExecucao {
//     private _listaPrecosSeparados: PrecoTipoExecucao[];

//     constructor({ precos }: { precos: ConstructorParameters<typeof PrecoTipoExecucao>[0][] }) {
//         this._listaPrecosSeparados = precos.filter(preco => SingletonHelper.getInstance().tipos_execucao.filter(tipo_execucao => tipo_execucao.id !== 1).map(tipo_execucao => tipo_execucao.id).includes(preco.idTipoExecucao)).map(preco => new PrecoTipoExecucao(preco));
//     }

//     get listaPrecos(): PrecoTipoExecucao[] {
//         const novaLista: PrecoTipoExecucao[] = [];

//         const agrupados = this._listaPrecosSeparados.reduce((map, preco) => {
//             const id = preco.refTipoExecucao.id;
//             if (!map.has(id)) map.set(id, { idTipoExecucao: id, quantidadeExecucoes: 0 });
//             map.get(id)!.quantidadeExecucoes += preco.quantidadeExecucoes;
//             return map;
//         }, new Map<number, { idTipoExecucao: number, quantidadeExecucoes: number }>());

//         const agrupadosFiltrados = Array.from(agrupados.values()).filter(preco => preco.quantidadeExecucoes > 0);

//         if (agrupadosFiltrados.length > 0) {
//             novaLista.push(
//                 ...agrupadosFiltrados.map(({ idTipoExecucao, quantidadeExecucoes }) =>
//                     new PrecoTipoExecucao({ idTipoExecucao, quantidadeExecucoes })
//                 )
//             );
//         } else {
//             novaLista.push(new PrecoTipoExecucao({ idTipoExecucao: 1, quantidadeExecucoes: 0 }));
//         }

//         return novaLista;
//     }

//     get descricaoListaPreco(): string { return this.listaPrecos.map(preco => preco.descricaoPreco).join(' e '); }
//     get temApenasAcaoLivre(): boolean { return !this.listaPrecos.some(preco => preco.refTipoExecucao.id !== 1); }

//     get podePagar(): boolean { return ControladorExecucoesPersonagem.podePagarPreco(this); }
//     get resumoPagamento(): string { return ControladorExecucoesPersonagem.resumoPagamento(this).join(' e '); }

//     pagaExecucao() {
//         const resumoPagamento = ControladorExecucoesPersonagem.resumoPagamento(this);
//         ControladorExecucoesPersonagem.pagaPrecoExecucao(this);
//         LoggerHelper.getInstance().adicionaMensagem(resumoPagamento.join(' e '));
//     }
// }

// export class ControladorExecucoesPersonagem {
//     static podePagarPreco(precoExecucao: PrecoExecucao): boolean {
//         const { totalPadraoNecessario, disponivelPadrao } = this.calculaCustos(precoExecucao);

//         return disponivelPadrao >= totalPadraoNecessario;
//     }

//     static pagaPrecoExecucao(precoExecucao: PrecoExecucao): void {
//         const { custoPadrao, custoMovimento, deficitMovimento } = this.calculaCustos(precoExecucao);

//         const { execucoes } = useClasseContextualPersonagemEstatisticasBuffaveis();
//         const execucaoPadrao = execucoes.find(exec => exec.refTipoExecucao.id === 2)!;
//         const execucaoMovimento = execucoes.find(exec => exec.refTipoExecucao.id === 3)!;

//         execucaoMovimento.numeroAcoesAtuais = Math.max(0, execucaoMovimento.numeroAcoesAtuais - custoMovimento);
//         execucaoPadrao.numeroAcoesAtuais -= custoPadrao + deficitMovimento;
//     }

//     private static calculaCustos(precoExecucao: PrecoExecucao) {
//         const { execucoes } = useClasseContextualPersonagemEstatisticasBuffaveis();

//         let custoPadrao = 0;
//         let custoMovimento = 0;

//         for (const preco of precoExecucao.listaPrecos) {
//             if (preco.refTipoExecucao.id === 2) {
//                 custoPadrao += preco.quantidadeExecucoes;
//             } else if (preco.refTipoExecucao.id === 3) {
//                 custoMovimento += preco.quantidadeExecucoes;
//             }
//         }

//         const execucaoPadrao = execucoes.find(exec => exec.refTipoExecucao.id === 2);
//         const execucaoMovimento = execucoes.find(exec => exec.refTipoExecucao.id === 3);

//         const disponivelPadrao = execucaoPadrao?.numeroAcoesAtuais || 0;
//         const disponivelMovimento = execucaoMovimento?.numeroAcoesAtuais || 0;

//         const deficitMovimento = Math.max(0, custoMovimento - disponivelMovimento);
//         const totalPadraoNecessario = custoPadrao + deficitMovimento;

//         return { custoPadrao, custoMovimento, deficitMovimento, totalPadraoNecessario, disponivelPadrao, disponivelMovimento };
//     }

//     static resumoPagamento(precoExecucao: PrecoExecucao): string[] {
//         const { custoPadrao, custoMovimento, deficitMovimento, disponivelMovimento } = this.calculaCustos(precoExecucao);

//         const log: string[] = [];
//         if (custoMovimento > 0) {
//             const gastoMovimento = Math.min(custoMovimento, disponivelMovimento);
//             if (gastoMovimento > 0) {
//                 log.push(`${gastoMovimento} ${pluralize(gastoMovimento, 'Ação', 'Ações')} de Movimento`);
//             }
//             if (deficitMovimento > 0) {
//                 log.push(`${deficitMovimento} ${pluralize(deficitMovimento, 'Ação', 'Ações')} Padrão (Substituindo Ação de Movimento)`);
//             }
//         }
//         if (custoPadrao > 0) {
//             log.push(`${custoPadrao} ${pluralize(custoPadrao, 'Ação', 'Ações')} Padrão`);
//         }

//         return log;
//     }
// }

// export type ExecucaoModificada =
//     { tipo: 'Diminui', passo: number }
//     |
//     { tipo: 'Sobreescreve', novoGasto: ConstructorParameters<typeof CustoExecucao>[0] }