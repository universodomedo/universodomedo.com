// #region Imports
import { AtributoPersonagem, CirculoNivelRitual, Elemento, Extremidade, NivelComponente, PatentePericia, Pericia, PericiaPatentePersonagem } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
// #endregion

export class ComportamentosAcao {
    // precisaMunica
        // nomeMunicao
        // usosMunicao
}

export class ComportamentosBuff {
    private _comportamentoBuffAtivo?: ComportamentoBuffAtivo;
    get temComportamentoBuffAtivo(): boolean { return Boolean(this._comportamentoBuffAtivo); } 
    setComportamentoBuffAtivo(...args: ConstructorParameters<typeof ComportamentoBuffAtivo>): void { this._comportamentoBuffAtivo = new ComportamentoBuffAtivo(...args); }

    private _comportamentoPassivo?: ComportamentoBuffPassivo;
    get temComportamentoBuffPassivo(): boolean { return Boolean(this._comportamentoPassivo); }
    setComportamentoBuffPassivo(...args: ConstructorParameters<typeof ComportamentoBuffPassivo>): void { this._comportamentoPassivo = new ComportamentoBuffPassivo(...args); }

    get ehPassivaAtivaQuandoEmpunhado(): boolean { return this.temComportamentoBuffPassivo && this._comportamentoPassivo?.precisaEstarEmpunhando!; }
    get ehPassivaAtivaQuandoVestido(): boolean { return this.temComportamentoBuffPassivo && this._comportamentoPassivo?.precisaEstarVestindo!; }
}

export class ComportamentoBuffAtivo {

}

export class ComportamentoBuffPassivo {
    constructor(
        public precisaEstarEmpunhando: boolean = false,
        public precisaEstarVestindo: boolean = false,
    ) { }
}

export class Comportamentos {
    private _comportamentoUtilizavel?: ComportamentoUtilizavel;
    get temComportamentoUtilizavel(): boolean { return Boolean(this._comportamentoUtilizavel); }
    get comportamentoUtilizavel(): ComportamentoUtilizavel { return this._comportamentoUtilizavel!; } // sempre verificar se temComportamentoUtilizavel antes
    setComportamentoUtilizavel(...args: ConstructorParameters<typeof ComportamentoUtilizavel>): void { this._comportamentoUtilizavel = new ComportamentoUtilizavel(...args); }

    private _comportamentoEmpunhavel?: ComportamentoEmpunhavel;
    get temComportamentoEmpunhavel(): boolean { return Boolean(this._comportamentoEmpunhavel); }
    get comportamentoEmpunhavel(): ComportamentoEmpunhavel { return this._comportamentoEmpunhavel!; } // sempre verificar se temComportamentoEmpunhavel antes
    setComportamentoEmpunhavel(...args: ConstructorParameters<typeof ComportamentoEmpunhavel>): void { this._comportamentoEmpunhavel = new ComportamentoEmpunhavel(...args); }

    private _comportamentoVestivel?: ComportamentoVestivel;
    get temComportamentoVestivel(): boolean { return Boolean(this._comportamentoVestivel); }
    get comportamentoVestivel(): ComportamentoVestivel { return this._comportamentoVestivel!; } // sempre verificar se temComportamentoVestivel antes
    setComportamentoVestivel(...args: ConstructorParameters<typeof ComportamentoVestivel>): void { this._comportamentoVestivel = new ComportamentoVestivel(...args); }

    private _comportamentoComponente?: ComportamentoComponente;
    get temComportamentoComponente(): boolean { return Boolean(this._comportamentoComponente); }
    get comportamentoComponente(): ComportamentoComponente { return this._comportamentoComponente!; } // sempre verificar se temComportamentoComponente antes
    setComportamentoComponente(...args: ConstructorParameters<typeof ComportamentoComponente>): void { this._comportamentoComponente = new ComportamentoComponente(...args); }

    private _comportamentoAcao?: ComportamentoAcao;
    get temComportamentoAcao(): boolean { return Boolean(this._comportamentoAcao); }
    get comportamentoAcao(): ComportamentoAcao { return this._comportamentoAcao!; } // sempre verifficar se temComportamentoAcao antes
    setComportamentoAcao(...args: ConstructorParameters<typeof ComportamentoAcao>): void { this._comportamentoAcao = new ComportamentoAcao(...args); }

    private _comportamentoAtributoPericia?: ComportamentoAtributoPericia;
    get temComportamentoAtributoPericia(): boolean { return Boolean(this._comportamentoAtributoPericia); }
    get comportamentoAtributoPericia(): ComportamentoAtributoPericia { return this._comportamentoAtributoPericia!; } // sempre verificar se temComportamentoAtributoPericia antes
    setComportamentoAtributoPericia(...args: ConstructorParameters<typeof ComportamentoAtributoPericia>): void { this._comportamentoAtributoPericia = new ComportamentoAtributoPericia(...args); }

    private _comportamentoRitual?: ComportamentoRitual;
    get temComportamentoRitual(): boolean { return Boolean(this._comportamentoRitual); }
    get comportamentoRitual(): ComportamentoRitual { return this._comportamentoRitual!; } // sempre verificar se temComportamentoRitual antes
    setComportamentoRitual(...args: ConstructorParameters<typeof ComportamentoRitual>): void { this._comportamentoRitual = new ComportamentoRitual(...args); }

    private _comportamentoRequisito?: ComportamentoRequisito;
    get temComportamentoRequisito(): boolean { return Boolean(this._comportamentoRequisito); }
    get comportamentoRequisito(): ComportamentoRequisito { return this._comportamentoRequisito!; } // sempre verificar se temComportamentoRequisito antes
    setComportamentoRequisito(...args: ConstructorParameters<typeof ComportamentoRequisito>): void { this._comportamentoRequisito = new ComportamentoRequisito(...args); }

    get podeSerEmpunhado(): boolean { return this.temComportamentoEmpunhavel && this.comportamentoEmpunhavel.podeSerEmpunhado; }
    get podeSerVestido(): boolean { return this.temComportamentoVestivel && this.comportamentoVestivel.podeSerVestido; }
    get podeGastarUsos(): boolean { return this.temComportamentoUtilizavel && this.comportamentoUtilizavel.usosMaximo > 0; }

    get estaEmpunhado(): boolean { return this.podeSerEmpunhado && this.comportamentoEmpunhavel.estaEmpunhado }
    get estaVestido(): boolean { return this.podeSerVestido && this.comportamentoVestivel.estaVestido }

    get ehComponente(): boolean { return this.temComportamentoComponente; }

    get requisitoEstaCumprido(): boolean { return !this.temComportamentoRequisito || (this.temComportamentoRequisito && this.comportamentoRequisito.requisitoCumprido ); }
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

export class ComportamentoComponente {
    constructor(
        private _idElemento: number,
        private _idNivelComponente: number,
    ) { }

    get refElemento(): Elemento { return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === this._idElemento)!; }
    get refNivelComponente(): NivelComponente { return SingletonHelper.getInstance().niveis_componente.find(nivel_componente => nivel_componente.id === this._idNivelComponente)!; }
}

export class ComportamentoAcao {
    constructor (
        public tipo: 'Dano' | 'Cura',
        public valorMin: number,
        public valorMax: number,
        public precisaTestePericia: boolean = false,
    ) { }

    get variancia(): number { return this.valorMax - this.valorMin; }
}

export class ComportamentoAtributoPericia {
    constructor(
        private _idAtributoBase: number,
        private _idPericiaBase: number,
    ) { }

    get refAtributoUtilizadoArma(): AtributoPersonagem { return getPersonagemFromContext().atributos.find(atributo => atributo.refAtributo.id === this._idAtributoBase)!; }
    get refPericiaUtilizadaArma(): PericiaPatentePersonagem { return getPersonagemFromContext().pericias.find(pericia => pericia.refPericia.id === this._idPericiaBase)!; }
}

export class ComportamentoRitual {
    constructor(
        private _idElemento: number,
        private _idCirculoNivel: number,
    ) { }

    get refElemento(): Elemento { return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === this._idElemento)!; }
    get refCirculoNivelRitual(): CirculoNivelRitual { return SingletonHelper.getInstance().circulos_niveis_ritual.find(circulo_nivel_ritual => circulo_nivel_ritual.id === this._idCirculoNivel)!; }
    get refNivelComponente(): NivelComponente { return SingletonHelper.getInstance().niveis_componente.find(nivel_componente => nivel_componente.id === this.refCirculoNivelRitual.idCirculo)! }
}

export class ComportamentoRequisito {
    constructor(
        public requisitoFuncionamento: { idPericia: number, idPatente: number }
    ) { }

    get refPericia(): Pericia { return SingletonHelper.getInstance().pericias.find(pericia => pericia.id === this.requisitoFuncionamento.idPericia)!; }
    get refPatente(): PatentePericia { return SingletonHelper.getInstance().patentes_pericia.find(patente_pericia => patente_pericia.id === this.requisitoFuncionamento.idPatente)!; }

    get requisitoCumprido(): boolean { return getPersonagemFromContext().pericias.find(pericia => pericia.refPericia.id === this.refPericia.id)!.refPatente.id >= this.requisitoFuncionamento.idPatente; }
}