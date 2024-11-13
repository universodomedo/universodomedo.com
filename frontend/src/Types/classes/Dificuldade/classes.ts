// #region Imports
import { AcaoHabilidade, PericiaPatentePersonagem } from 'Types/classes/index.ts';
import { FichaHelper, LoggerHelper, SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export abstract class Dificuldade {
    constructor(
        private _idPericia: number
    ) { }

    public refAcao?: AcaoHabilidade;
    setRefAcao(value: AcaoHabilidade): this { return (this.refAcao = value, this); }

    get refPericiaPersonagem(): PericiaPatentePersonagem { return FichaHelper.getInstance().personagem.pericias.find(pericia => pericia.refPericia.id === this._idPericia)!; }
    abstract get valor(): number;
    abstract get descricaoDificuldade(): string;
    abstract processa(): boolean;
}

export class DificuldadeFixa extends Dificuldade {
    constructor(
        idPericia: number,
        public valor: number
    ) { super(idPericia); }

    get descricaoDificuldade(): string { return ``; }

    processa(): boolean {
        return true;
    }
}

export class DificuldadeConsecutiva extends Dificuldade {
    constructor(
        idPericia: number,
        public valorInicial: number,
        public valorConsecutivo: number
    ) { super(idPericia); }

    get valor(): number { return this.valorInicial + (this.valorConsecutivo * this.refAcao!.vezesUtilizadasConsecutivo) }
    get descricaoDificuldade(): string { return `DT ${this.valor} de ${this.refPericiaPersonagem.refPericia.nomeAbrev}${this.refAcao!.bloqueadoNesseTurno ? ` | Falhou nesse turno` : ''}`; }

    processa(): boolean {
        LoggerHelper.getInstance().adicionaMensagem(`Rodando ${this.refPericiaPersonagem.refPericia.nomeAbrev} DT ${this.valor}`);

        const resultadoTeste = this.refPericiaPersonagem.obterResultadoVariacao();
        
        if (resultadoTeste.resultado < this.valor) {
            LoggerHelper.getInstance().adicionaMensagem(`Falha - ${resultadoTeste.resultado}`, true);
            return (this.processaFalha(), false);
        } else {
            LoggerHelper.getInstance().adicionaMensagem(`Sucesso - ${resultadoTeste.resultado}`, true);
            return (this.processaSucesso(), true);
        }
    }

    processaSucesso(): void {
        this.refAcao?.novoUso();
    }

    processaFalha(): void {
        this.refAcao?.bloqueia();
    }
}