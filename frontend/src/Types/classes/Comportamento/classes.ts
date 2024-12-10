// #region Imports
import { AtributoPersonagem, Elemento, Extremidade, NivelComponente, PericiaPatentePersonagem } from 'Types/classes/index.ts';
import { FichaHelper, SingletonHelper } from 'Types/classes_estaticas.tsx';
// #endregion

export type DetalhesItem = {
    precisaEstarEmpunhado?: boolean,
    podeSerVestido?: boolean,
    precisaEstarVetindo?: boolean,
}

export function inicializarDetalhesItem(partial?: Partial<DetalhesItem>): DetalhesItem {
    return {
        precisaEstarEmpunhado: false,
        podeSerVestido: false,
        precisaEstarVetindo: false,
        ...partial,
    };
}

export class ComportamentoGeral {
    private _detalhesOfensivo?: DetalhesOfensivo;
    private _detelhesComponente?: DetalhesComponente;
    public vezesUtilizadasConsecutivo: number = 0;
    public bloqueadoNesseTurno: boolean = true;

    constructor() { }

    get temDetalhesOfensivo(): boolean { return this._detalhesOfensivo !== undefined; }
    set detalhesOfensivo(detalhes: { danoMin: number, danoMax: number, idAtributoBase: number, idPericiaBase: number }) { this._detalhesOfensivo = new DetalhesOfensivo(detalhes.danoMin, detalhes.danoMax, detalhes.idAtributoBase, detalhes.idPericiaBase); }
    get detalhesOfensivo(): DetalhesOfensivo { return this._detalhesOfensivo!; }

    get temDetalhesComponente(): boolean { return this._detelhesComponente !== undefined; }
    set detelhesComponente(detalhes: { idElemento: number, idNivelComponente: number }) { this._detelhesComponente = new DetalhesComponente(detalhes.idElemento, detalhes.idNivelComponente); }
    get detelhesComponente(): DetalhesComponente { return this._detelhesComponente!; }

    novoUso() { this.vezesUtilizadasConsecutivo++; }
    bloqueia() { this.bloqueadoNesseTurno = true; }
}

export class ComportamentoUtilizavel {
    public usosAtuais: number = 0;

    constructor(public usosMaximo: number = 0) { this.usosAtuais = this.usosMaximo; }

    gastaUsoERetornaSePrecisaRemover(): boolean {
        // se não tem maximo, nunca consome, nunca remove
        if (this.usosMaximo <= 0) return false;

        this.usosAtuais--;
        // se for 0 ou menor, retorna que o item deve ser removido
        return this.usosAtuais <= 0;
    }
}

export class ComportamentoEmpunhavel {
    public refExtremidade?: Extremidade;

    constructor(public podeSerEmpunhado: boolean = true) { }

    get estaEmpunhado(): boolean { return this.refExtremidade !== undefined; }

    empunha(idItem: number): void {
        this.refExtremidade = FichaHelper.getInstance().personagem.estatisticasBuffaveis.extremidades.find(extremidade => !extremidade.estaOcupada);
        this.refExtremidade?.empunhar(idItem);
    }

    desempunha(): void {
        this.refExtremidade?.guardar();
        this.refExtremidade = undefined;
    }
}

export class ComportamentoVestivel {
    private _estaVestido: boolean = false;

    constructor(public podeSerVestido: boolean = false) { }

    get estaVestido(): boolean { return this._estaVestido; }

    veste(): void { if (this.podeSerVestido) this._estaVestido = true; }
    desveste(): void { if (this.podeSerVestido) this._estaVestido = false; }
}

class DetalhesOfensivo {
    constructor(
        public danoMin: number,
        public danoMax: number,
        private _idAtributoBase: number,
        private _idPericiaBase: number,
    ) { }

    get varianciaDeDano(): number { return this.danoMax - this.danoMin; }
    get refAtributoUtilizadoArma(): AtributoPersonagem { return FichaHelper.getInstance().personagem.atributos.find(atributo => atributo.refAtributo.id === this._idAtributoBase)!; }
    get refPericiaUtilizadaArma(): PericiaPatentePersonagem { return FichaHelper.getInstance().personagem.pericias.find(pericia => pericia.refPericia.id === this._idPericiaBase)!; }
}

class DetalhesComponente {
    constructor(
        private _idElemento: number,
        private _idNivelComponente: number,
    ) { }

    get refElemento(): Elemento { return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === this._idElemento)!; }
    get refNivelComponente(): NivelComponente { return SingletonHelper.getInstance().niveis_componente.find(nivel_componente => nivel_componente.id === this._idNivelComponente)!; }
}