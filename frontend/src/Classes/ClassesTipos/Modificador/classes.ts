import { Acao, DadosEfeito, Duracao, Efeito, Habilidade, Item } from 'Classes/ClassesTipos/index.ts';

export type Modificador = {
    nome: string;
    quantidadeDuracaoMaxima: number;
    efeitos: Efeito[];
    readonly refPai: Acao | Habilidade | Item;
    readonly tipoRefPai: 'Ação' | 'Habilidade' | 'Item';
    svg: string;
    quantidadeDuracaoAtual: number;
    readonly refDuracao: Duracao;
    readonly codigoUnico: string;
    readonly textoDuracao: string;
    tipoModificador: { tipo: 'Ativo' } | { tipo: 'Passivo', requisito?: 'Empunhar' | 'Equipar' };
};

export type DadosModificador = Pick<Modificador, 'nome' | 'quantidadeDuracaoMaxima' | 'quantidadeDuracaoAtual' | 'tipoModificador'> & {
    idDuracao: number;
    dadosEfeitos: DadosEfeito[];
};






// export class Modificador {
//     private static contadorId = 0;
//     private _id: number;

//     public nome: string;
//     private _idDuracao: number;
//     public quantidadeDuracaoMaxima: number;
//     public quantidadeDuracaoAtual: number = 0;
//     public efeitos: Efeito[] = [];
//     public comportamentos: ComportamentosModificador = new ComportamentosModificador();

//     public refPai?: Acao | HabilidadePassiva | Item;

//     public svg = `PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Zz48dGl0bGU+TGF5ZXIgMTwvdGl0bGU+PHRleHQgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjAiIHg9IjU3IiB5PSIxMTQiIGlkPSJzdmdfMSIgZm9udC1zaXplPSIxNTAiIGZvbnQtZmFtaWx5PSJOb3RvIFNhbnMgSlAiIHRleHQtYW5jaG9yPSJzdGFydCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+RTwvdGV4dD48L2c+PC9zdmc+`;

//     constructor({ nome, idDuracao, quantidadeDuracaoMaxima, dadosEfeitos, dadosComportamentos }: { nome: string, idDuracao: number, quantidadeDuracaoMaxima: number, dadosEfeitos: ConstructorParameters<typeof Efeito>[0][], dadosComportamentos: DadosComportamentosModificador }) {
//         this._id = Modificador.contadorId++;
//         this.nome = nome;
//         this._idDuracao = idDuracao;
//         this.efeitos = dadosEfeitos.map(dados => new Efeito(dados));
//         this.quantidadeDuracaoMaxima = quantidadeDuracaoMaxima;

//         if (dadosComportamentos.dadosComportamentoAtivo !== undefined) this.comportamentos.setComportamentoModificadorAtivo(...dadosComportamentos.dadosComportamentoAtivo);
//         if (dadosComportamentos.dadosComportamentoPassivo !== undefined) this.comportamentos.setComportamentoModificadorPassivo(...dadosComportamentos.dadosComportamentoPassivo);
//     }

//     get codigoUnico(): string { return `${this._id}:${this.nome}`; }

//     get refDuracao(): Duracao { return SingletonHelper.getInstance().duracoes.find(duracao => duracao.id === this._idDuracao)!; }

//     ativaBuff() { getPersonagemFromContext().controladorModificadores.adicionaModificador(this); }
//     desativaBuff() { getPersonagemFromContext().controladorModificadores.removeModificador(this); }
//     adicionaRefPai(pai: Acao | HabilidadePassiva | Item): this { return (this.refPai = pai), this; }

//     gastaDuracaoERetornaSePrecisaRemover = (): boolean => {
//         this.quantidadeDuracaoAtual--;

//         return this.quantidadeDuracaoAtual <= 0;
//         // if (this.quantidadeDuracaoAtual <= 0) {
//         //     this.desativaBuff();
//         // } else {
//         //     LoggerHelper.getInstance().adicionaMensagem(`${this.nome}: ${this.quantidadeDuracaoAtual} ${this.refBuff.nome} para terminar`);
//         // }
//     }

//     get textoDuracao(): string {
//         if (this._idDuracao === 5)
//             return `Duração ${this.refDuracao.nome}`;

//         let retorno = 'Encerra';

//         if (this.quantidadeDuracaoAtual > 2)
//             return `${retorno} em ${this.quantidadeDuracaoAtual} ${pluralize(this.quantidadeDuracaoAtual, this.refDuracao.nome)}`;

//         if (this._idDuracao === 1) {
//             if (this.quantidadeDuracaoAtual === 1)
//                 retorno += ` depois dessa ${this.refDuracao.nome}`;
//             if (this.quantidadeDuracaoAtual === 2)
//                 retorno += ` depois da próxima ${this.refDuracao.nome}`;
//         }

//         if (this._idDuracao === 2) {
//             if (this.quantidadeDuracaoAtual === 1)
//                 retorno += ` no fim desse ${this.refDuracao.nome}`;
//             if (this.quantidadeDuracaoAtual === 2)
//                 retorno += ` depois do próximo ${this.refDuracao.nome}`;
//         }

//         if (this._idDuracao === 3) {
//             if (this.quantidadeDuracaoAtual === 1)
//                 retorno += ` no fim dessa ${this.refDuracao.nome}`;
//             if (this.quantidadeDuracaoAtual === 2)
//                 retorno += ` depois da próxima ${this.refDuracao.nome}`;
//         }

//         if (this._idDuracao === 4) {
//             if (this.quantidadeDuracaoAtual === 1)
//                 retorno += ` no fim desse ${this.refDuracao.nome}`;
//             if (this.quantidadeDuracaoAtual === 2)
//                 retorno += ` depois do próximo ${this.refDuracao.nome}`;
//         }

//         return retorno;
//     }

//     static get filtroProps(): FiltroProps<Modificador> {
//         return new FiltroProps<Modificador>(
//             [
//                 new FiltroPropsItems<Modificador>(
//                     (buff) => buff.nome,
//                     'Nome da Fonte do Efeito',
//                     'Procure pela Fonte do Efeito',
//                     'text',
//                     true
//                 ),
//                 // new FiltroPropsItems<Buff>(
//                 //     (buff) => buff.refBuff.nome,
//                 //     'Alvo do Efeito',
//                 //     'Selecione o Alvo',
//                 //     'select',
//                 //     true,
//                 //     new OpcoesFiltro(
//                 //         FichaHelper.getInstance().personagem.buffsAplicados.listaObjetosBuff.map((buff) => {
//                 //             const buffRef = BuffRef.obtemBuffRefPorId(buff.idBuff);
//                 //             return {
//                 //                 id: buffRef,
//                 //                 nome: buffRef
//                 //             } as OpcaoFiltro;
//                 //         })
//                 //     )
//                 // ),
//                 // new FiltroPropsItems<Buff>(
//                 //     (buff) => buff.refTipoBuff.id,
//                 //     'Tipo do Efeito',
//                 //     'Selecione o Tipo do Efeito Alvo',
//                 //     'select',
//                 //     true,
//                 //     new OpcoesFiltro(
//                 //         SingletonHelper.getInstance().tipos_buff.map((tipo_buff) => {
//                 //             return {
//                 //                 id: tipo_buff.id,
//                 //                 nome: tipo_buff.nome
//                 //             }
//                 //         })
//                 //     )
//                 // ),
//             ],
//         )
//     }
// }