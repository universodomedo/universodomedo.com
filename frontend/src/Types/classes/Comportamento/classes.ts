// #region Imports
import { AtributoPersonagem, Elemento, Extremidade, NivelComponente, PericiaPatentePersonagem } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
// #endregion

export type DetalhesItem = {
    precisaEstarEmpunhado?: boolean,
    podeSerVestido?: boolean,
    precisaEstarVetindo?: boolean,
    detalhesOfensivo?: DetalhesOfensivo,
    detalhesComponente?: DetalhesComponente,
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
    private _detalhesComponente?: DetalhesComponente;
    public vezesUtilizadasConsecutivo: number = 0;
    public bloqueadoNesseTurno: boolean = false;

    constructor({ detalhesOfensivo, detalhesComponente, }: { detalhesOfensivo?: DetalhesOfensivo; detalhesComponente?: DetalhesComponente; } = {}) {
        if (detalhesOfensivo !== undefined)
            this._detalhesOfensivo = detalhesOfensivo;
        if (detalhesComponente !== undefined)
            this._detalhesComponente = detalhesComponente;
    }

    get temDetalhesOfensivo(): boolean { return this._detalhesOfensivo !== undefined; }
    get detalhesOfensivo(): DetalhesOfensivo { return this._detalhesOfensivo!; }

    get temDetalhesComponente(): boolean { return this._detalhesComponente !== undefined; }
    get detalhesComponente(): DetalhesComponente { return this._detalhesComponente!; }

    novoUso() { this.vezesUtilizadasConsecutivo++; }
    bloqueia() { this.bloqueadoNesseTurno = true; }
}

export class ComportamentoUtilizavel {
    public usosAtuais: number = 0;

    constructor(public usosMaximo: number = 0, usosAtuais?: number) {
        this.usosAtuais = (usosAtuais === undefined ? this.usosMaximo : usosAtuais);
    }

    gastaUsoERetornaSePrecisaRemover(): boolean {
        // se não tem maximo, nunca consome, nunca remove
        if (this.usosMaximo <= 0) return false;

        this.usosAtuais--;
        // se for 0 ou menor, retorna que o item deve ser removido
        return this.usosAtuais <= 0;
    }
}

export class ComportamentoEmpunhavel {
    public refExtremidades: Extremidade[] = [];

    constructor(public podeSerEmpunhado: boolean = true, public extremidadesNecessarias: number = 1) { }

    get estaEmpunhado(): boolean { return this.refExtremidades.length === this.extremidadesNecessarias; }

    empunha(idItem: number): void {
        this.refExtremidades = getPersonagemFromContext().estatisticasBuffaveis.extremidades.filter(extremidade => !extremidade.estaOcupada).slice(0, this.extremidadesNecessarias);
        this.refExtremidades.forEach(extremidade => extremidade.empunhar(idItem));
    }

    desempunha(): void {
        this.esvaziaExtremidades();
        this.refExtremidades = [];
    }

    esvaziaExtremidades(): void { this.refExtremidades.forEach(extremidade => extremidade.guardar()); }
}

export class ComportamentoVestivel {
    private _estaVestido: boolean = false;

    constructor(public podeSerVestido: boolean = false) { }

    get estaVestido(): boolean { return this._estaVestido; }

    veste(): void { if (this.podeSerVestido) this._estaVestido = true; }
    desveste(): void { if (this.podeSerVestido) this._estaVestido = false; }
}

export class DetalhesOfensivo {
    constructor(
        public danoMin: number,
        public danoMax: number,
        private _idAtributoBase: number,
        private _idPericiaBase: number,
    ) { }

    get varianciaDeDano(): number { return this.danoMax - this.danoMin; }
    get refAtributoUtilizadoArma(): AtributoPersonagem { return getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === this._idAtributoBase)!; }
    get refPericiaUtilizadaArma(): PericiaPatentePersonagem { return getPersonagemFromContext().pericias.find(pericia => pericia.refPericia.id === this._idPericiaBase)!; }
}

export class DetalhesAcoes {
    constructor (
        public tipo: 'Dano' | 'Cura',
        public valorMin: number,
        public valorMax: number,
    ) { }

    get variancia(): number { return this.valorMax - this.valorMin; }
}

export class DetalhesComponente {
    constructor(
        private _idElemento: number,
        private _idNivelComponente: number,
    ) { }

    get refElemento(): Elemento { return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === this._idElemento)!; }
    get refNivelComponente(): NivelComponente { return SingletonHelper.getInstance().niveis_componente.find(nivel_componente => nivel_componente.id === this._idNivelComponente)!; }
}