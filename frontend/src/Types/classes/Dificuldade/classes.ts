// #region Imports
import { Acao, PericiaPatentePersonagem } from 'Types/classes/index.ts';
import { LoggerHelper } from 'Types/classes_estaticas.tsx';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
// #endregion

// export abstract class Dificuldade {
//     constructor(
//         private _idPericia: number
//     ) { }

//     public refAcao?: Acao;
//     setRefAcao(value: Acao): this { return (this.refAcao = value, this); }

//     get refPericiaPersonagem(): PericiaPatentePersonagem { return getPersonagemFromContext().pericias.find(pericia => pericia.refPericia.id === this._idPericia)!; }
//     abstract get valor(): number;
//     abstract get descricaoDificuldade(): string;
//     abstract processa(): boolean;
// }

// export class DificuldadeFixa extends Dificuldade {
//     constructor(
//         idPericia: number,
//         public valor: number
//     ) { super(idPericia); }

//     get descricaoDificuldade(): string { return ``; }

//     processa(): boolean {
//         return true;
//     }
// }

// export class DificuldadeConsecutiva extends Dificuldade {
//     constructor(
//         idPericia: number,
//         public valorInicial: number,
//         public valorConsecutivo: number
//     ) { super(idPericia); }

//     get valor(): number { return this.valorInicial + (this.valorConsecutivo * this.refAcao!.refPai.comportamentoGeral.vezesUtilizadasConsecutivo) }
//     get descricaoDificuldade(): string { return `${this.refPericiaPersonagem.refPericia.nomeAbrev} DT ${this.valor} ${this.refAcao!.refPai.comportamentoGeral.bloqueadoNesseTurno ? ` | Falhou nesse turno` : ''}`; }

//     processa(): boolean {
//         LoggerHelper.getInstance().adicionaMensagem(`Rodando ${this.refPericiaPersonagem.refPericia.nomeAbrev} DT ${this.valor}`);

//         const resultadoTeste = this.refPericiaPersonagem.obterResultadoVariacao();
        
//         if (resultadoTeste.resultado < this.valor) {
//             LoggerHelper.getInstance().adicionaMensagem(`Falha - ${resultadoTeste.resultado}`, true);
//             return (this.processaFalha(), false);
//         } else {
//             LoggerHelper.getInstance().adicionaMensagem(`Sucesso - ${resultadoTeste.resultado}`, true);
//             return (this.processaSucesso(), true);
//         }
//     }

//     processaSucesso(): void {
//         this.refAcao?.refPai.comportamentoGeral.novoUso();
//     }

//     processaFalha(): void {
//         this.refAcao?.refPai.comportamentoGeral.bloqueia();
//     }
// }


export class DificuldadeAberta {

}

export class DificuldadeDinamica {
    private _dificuldadeInicial: number;
    private _modificadorDificuldadeInicial: number = 0;
    public listaModificadoresDificuldade: number[] = [];

    public dificuldadeAtual: number;
    public modificadorDificuldadeAtual: number;
    private indiceListaModificadores: number = 0;

    constructor({ dificuldadeInicial, modificadorDificuldadeInicial = 0, listaModificadoresDificuldade = [] }: { dificuldadeInicial: number, modificadorDificuldadeInicial?: number, listaModificadoresDificuldade?: number[]}) {
        this._dificuldadeInicial = dificuldadeInicial;
        this._modificadorDificuldadeInicial = modificadorDificuldadeInicial;
        this.listaModificadoresDificuldade = listaModificadoresDificuldade;

        this.dificuldadeAtual = this._dificuldadeInicial;
        this.modificadorDificuldadeAtual = this._modificadorDificuldadeInicial;
    }

    atualizaDificuldade() {
        this.dificuldadeAtual += this.modificadorDificuldadeAtual;

        if (this.indiceListaModificadores < this.listaModificadoresDificuldade.length) {
            this.modificadorDificuldadeAtual += this.listaModificadoresDificuldade[this.indiceListaModificadores];

            this.indiceListaModificadores++;
        }
    }

    resetaDificuldade() { this.dificuldadeAtual = this._dificuldadeInicial; }
    resetaModificadorDificuldade() { this.modificadorDificuldadeAtual = this._modificadorDificuldadeInicial; this.indiceListaModificadores = 0; }
}