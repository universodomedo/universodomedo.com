// #region Imports
import { Atributo, AtributoPersonagem, CirculoNivelRitual, DificuldadeDinamica, Elemento, Extremidade, NivelComponente, NomeItem, PatentePericia, Pericia, PericiaPatentePersonagem } from 'Types/classes/index.ts';
import { SingletonHelper } from 'Types/classes_estaticas.tsx';

import { getPersonagemFromContext } from 'Recursos/ContainerComportamento/EmbrulhoFicha/contexto.tsx';
// #endregion

export class ComportamentosAcao {
    // precisaMunica
    // nomeMunicao
    // usosMunicao
}

export class ComportamentosModificador {
    private _comportamentoModificadorAtivo?: ComportamentoModificadorAtivo;
    get temComportamentoModificadorAtivo(): boolean { return Boolean(this._comportamentoModificadorAtivo); }
    setComportamentoModificadorAtivo(...args: ConstructorParameters<typeof ComportamentoModificadorAtivo>): void { this._comportamentoModificadorAtivo = new ComportamentoModificadorAtivo(...args); }

    private _comportamentoPassivo?: ComportamentoModificadorPassivo;
    get temComportamentoModificadorPassivo(): boolean { return Boolean(this._comportamentoPassivo); }
    setComportamentoModificadorPassivo(...args: ConstructorParameters<typeof ComportamentoModificadorPassivo>): void { this._comportamentoPassivo = new ComportamentoModificadorPassivo(...args); }

    get ehPassivoSempreAtivo(): boolean { return this.temComportamentoModificadorPassivo && (!this._comportamentoPassivo!.precisaEstarEmpunhando && !this._comportamentoPassivo!.precisaEstarVestindo)}
    get ehPassivoAtivaQuandoEmpunhado(): boolean { return this.temComportamentoModificadorPassivo && this._comportamentoPassivo!.precisaEstarEmpunhando; }
    get ehPassivoAtivaQuandoVestido(): boolean { return this.temComportamentoModificadorPassivo && this._comportamentoPassivo!.precisaEstarVestindo; }
}

export class ComportamentoModificadorAtivo {

}

export class ComportamentoModificadorPassivo {
    constructor(
        public precisaEstarEmpunhando: boolean = false,
        public precisaEstarVestindo: boolean = false,
    ) { }
}

export class EmbrulhoComportamentoItem {
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

    private _comportamentoUtilizavel?: ComportamentoUtilizavel;
    get temComportamentoUtilizavel(): boolean { return Boolean(this._comportamentoUtilizavel); }
    get comportamentoUtilizavel(): ComportamentoUtilizavel { return this._comportamentoUtilizavel!; } // sempre verificar se temComportamentoUtilizavel antes
    setComportamentoUtilizavel(...args: ConstructorParameters<typeof ComportamentoUtilizavel>): void { this._comportamentoUtilizavel = new ComportamentoUtilizavel(...args); }

    private _comportamentoMunicao?: ComportamentoMunicao;
    get temComportamentoMunicao(): boolean { return Boolean(this._comportamentoMunicao); }
    get comportamentoMunicao(): ComportamentoMunicao { return this._comportamentoMunicao!; } // sempre verificar se temComportamentoMunicao antes
    setComportamentoMunicao(...args: ConstructorParameters<typeof RequisitoMunicao>[]): void { this._comportamentoMunicao = new ComportamentoMunicao(args); }

    get podeSerEmpunhado(): boolean { return this.temComportamentoEmpunhavel && this.comportamentoEmpunhavel.podeSerEmpunhado; }
    get podeSerVestido(): boolean { return this.temComportamentoVestivel && this.comportamentoVestivel.podeSerVestido; }

    get estaEmpunhado(): boolean { return this.podeSerEmpunhado && this.comportamentoEmpunhavel.estaEmpunhado }
    get estaVestido(): boolean { return this.podeSerVestido && this.comportamentoVestivel.estaVestido }

    get ehComponente(): boolean { return this.temComportamentoComponente; }

    get podeGastarUsos(): boolean { return this.temComportamentoUtilizavel && this.comportamentoUtilizavel.usosMaximo > 0; }

    temMunicaoSuficiente(nomeMunicao: string, quantidadeMunicao: number) { return !this.temComportamentoMunicao || this.comportamentoMunicao.verificaMunicao(nomeMunicao, quantidadeMunicao) }
}

export class EmbrulhoComportamentoAcao {
    public comportamentoTrava: ComportamentoAcaoTrava = new ComportamentoAcaoTrava();
    public comportamentoHistoricoAcao: ComportamentoHistoricoAcao = new ComportamentoHistoricoAcao();

    private _comportamentoDificuldadeAcao?: ComportamentoDificuldadeAcao;
    get temComportamentoDificuldadeAcao(): boolean { return Boolean(this._comportamentoDificuldadeAcao); }
    get comportamentoDificuldadeAcao(): ComportamentoDificuldadeAcao { return this._comportamentoDificuldadeAcao!; } // sempre verificar se temComportamentoDificuldadeAcao antes
    setComportamentoDificuldadeAcao(...args: ConstructorParameters<typeof ComportamentoDificuldadeAcao>): void { this._comportamentoDificuldadeAcao = new ComportamentoDificuldadeAcao(...args); }

    private _comportamentoAcao?: ComportamentoAcao;
    get temComportamentoAcao(): boolean { return Boolean(this._comportamentoAcao); }
    get comportamentoAcao(): ComportamentoAcao { return this._comportamentoAcao!; } // sempre verificar se temComportamentoAcao antes
    setComportamentoAcao(...args: ConstructorParameters<typeof ComportamentoAcao>): void { this._comportamentoAcao = new ComportamentoAcao(...args); }

    private _comportamentoRequisito?: ComportamentoRequisito;
    get temComportamentoRequisito(): boolean { return Boolean(this._comportamentoRequisito); }
    get comportamentoRequisito(): ComportamentoRequisito { return this._comportamentoRequisito!; } // sempre verificar se temComportamentoRequisito antes
    setComportamentoRequisito(...args: ConstructorParameters<typeof RequisitoUso>[]): void { this._comportamentoRequisito = new ComportamentoRequisito(args); }

    private _comportamentoConsomeUso?: ComportamentoConsomeUso;
    get temComportamentoConsomeUso(): boolean { return Boolean(this._comportamentoConsomeUso); }
    get comportamentoConsomeUso(): ComportamentoConsomeUso { return this._comportamentoConsomeUso!; } // sempre verificar se temComportamentoConsomeUso antes
    setComportamentoConsomeUso(...args: ConstructorParameters<typeof ComportamentoConsomeUso>): void { this._comportamentoConsomeUso = new ComportamentoConsomeUso(...args); }

    private _comportamentoConsomeMunicao?: ComportamentoConsomeMunicao;
    get temComportamentoConsomeMunicao(): boolean { return Boolean(this._comportamentoConsomeMunicao); }
    get comportamentoConsomeMunicao(): ComportamentoConsomeMunicao { return this._comportamentoConsomeMunicao!; } // sempre verificar se temComportamentoConsomeMunicao antes
    setComportamentoConsomeMunicao(...args: ConstructorParameters<typeof ComportamentoConsomeMunicao>): void { this._comportamentoConsomeMunicao = new ComportamentoConsomeMunicao(...args); }

    get mensagemRequisitos(): string { return this.temComportamentoRequisito ? this.comportamentoRequisito.mensagemRequisitos : ''; }
    get requisitosCumpridos(): boolean { return !this.temComportamentoRequisito || this.comportamentoRequisito.requisitosCumprido; }

    get acaoTravada(): boolean { return this.comportamentoTrava.trava; }
    travaAcao() { this.comportamentoTrava.travaAcao('Você falhou'); }

    get temDificuldadeDeExecucao(): boolean { return this.temComportamentoDificuldadeAcao; }
    get ehDificuldadeDinamica(): boolean { return this.temDificuldadeDeExecucao && this.comportamentoDificuldadeAcao.temDificuldadeDinamica; }
    get dificuldadeDeExecucao(): number { return this.comportamentoDificuldadeAcao.dificuldadeDinamica!.dificuldadeAtual; } // sempre verificar se ehDificuldadeDinamica antes
    atualizaDificuldadeDeExecucao(): void { this.comportamentoDificuldadeAcao.dificuldadeDinamica!.atualizaDificuldade(); }
}

export class EmbrulhoComportamentoRitual {
    public comportamentoDescontosRitual = new ComportamentoDescontosRitual();

    private _comportamentoRitual?: ComportamentoRitual;
    get temComportamentoRitual(): boolean { return Boolean(this._comportamentoRitual); }
    get comportamentoRitual(): ComportamentoRitual { return this._comportamentoRitual!; } // sempre verificar se temComportamentoRitual antes
    setComportamentoRitual(...args: ConstructorParameters<typeof ComportamentoRitual>): void { this._comportamentoRitual = new ComportamentoRitual(...args); }
}

export class EmbrulhoComportamentoHabilidade {

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

    get numeroAcoesMovimentoParaSacarOuGuardar(): number { return 1; }

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

export class ComportamentoHistoricoAcao {
    public vezesUsadoCena: number = 0;
    public vezesUsadoTurno: number = 0;

    resetUsosCena() { this.vezesUsadoCena = 0; }
    resetUsosTurno() { this.vezesUsadoTurno = 0; }
}

export class ComportamentoAcaoTrava {
    public trava: boolean = false;
    public descricaoTrava: string = '';

    travaAcao(descricao: string) { this.trava = true; this.descricaoTrava = descricao; }
    destravaAcao() { this.trava = false; this.descricaoTrava = ''; }
}

export class ComportamentoDificuldadeAcao {
    public idAtributo: number;
    public idPericia: number;
    public dificuldadeDinamica?: DificuldadeDinamica;

    constructor(dadosTeste: { idAtributo: number, idPericia: number }, dadosDificuldadeDinamica?: ConstructorParameters<typeof DificuldadeDinamica>[0]) {
        this.idPericia = dadosTeste.idPericia;
        this.idAtributo = dadosTeste.idAtributo;

        if (dadosDificuldadeDinamica) this.dificuldadeDinamica = new DificuldadeDinamica(dadosDificuldadeDinamica);
    }

    get refPericia(): Pericia { return SingletonHelper.getInstance().pericias.find(pericia => pericia.id === this.idPericia)!; }
    get refAtributo(): Atributo { return SingletonHelper.getInstance().atributos.find(atributo => atributo.id === this.idAtributo)!; }

    get temDificuldadeDinamica(): boolean { return this.dificuldadeDinamica !== undefined; }
}

export class ComportamentoAcao {
    constructor(
        public tipo: 'Dano' | 'Cura',
        public valorMin: number,
        public valorMax: number,
        public opcionais: OpcionaisComportamentoAcao = {},
    ) { }

    get variancia(): number { return this.valorMax - this.valorMin; }
}

export type OpcionaisComportamentoAcao = {
    consomeUso?: { nomeUtilizavel: string },
    consomeMunicao?: { nomeMunicao: string, quantidadePorUso: number },
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

export class ComportamentoDescontosRitual {
    constructor(

    ) { }

    get valorDesconto(): number { return getPersonagemFromContext().obtemValorTotalComLinhaEfeito(0, 62); }
}

export class ComportamentoRequisito {
    public requisitos: RequisitoUso[];

    constructor(
        dadosRequisitos: ConstructorParameters<typeof RequisitoUso>[]
    ) {
        this.requisitos = dadosRequisitos.map(dadosRequisito => new RequisitoUso(...dadosRequisito));
    }

    get requisitosCumprido(): boolean { return this.requisitos.every(requisito => requisito.requisitoCumprido); }
    get mensagemRequisitos(): string { return this.requisitos.length > 0 ? `Você precisa ser ${this.requisitos.map(requisito => requisito.mensagemRequisito).join(' e ')}` : ''; }
}

export class RequisitoUso {
    constructor(
        private _idPericia: number,
        private _idPatentePericia: number,
    ) { }

    get refPericia(): Pericia { return SingletonHelper.getInstance().pericias.find(pericia => pericia.id === this._idPericia)!; }
    get refPatente(): PatentePericia { return SingletonHelper.getInstance().patentes_pericia.find(patente_pericia => patente_pericia.id === this._idPatentePericia)!; }

    get requisitoCumprido(): boolean { return getPersonagemFromContext().pericias.find(pericia => pericia.refPericia.id === this.refPericia.id)!.refPatente.id >= this.refPatente.id; }
    get mensagemRequisito(): string { return `${this.refPatente.nome} em ${this.refPericia.nomeAbrev}`; }
}

export class ComportamentoMunicao {
    public municoes: RequisitoMunicao[];

    constructor(
        dadosMunicoes: ConstructorParameters<typeof RequisitoMunicao>[]
    ) {
        this.municoes = dadosMunicoes.map(dadosMunicao => new RequisitoMunicao(...dadosMunicao));
    }

    verificaMunicao(nomeMunicao: string, quantidadeMunicao: number): boolean {
        const municao = this.municoes.find(m => m.nome === nomeMunicao);
        return (!municao ? false : municao.quantidadeAtual >= quantidadeMunicao)
    }
}

export class RequisitoMunicao {
    public quantidadeAtual: number = 0;

    constructor(
        public nome: string,
        public capacidadeMaxima: number,
    ) {
        this.quantidadeAtual = this.capacidadeMaxima;
    }
}

export class DadosGenericosItem {
    public idTipoItem: number;
    public nome: NomeItem;
    public peso: number;
    public categoria: number;

    constructor({ idTipoItem, nome, peso, categoria }: { idTipoItem: number; nome: ConstructorParameters<typeof NomeItem>; peso: number; categoria: number; }) {
        this.idTipoItem = idTipoItem;
        this.nome = new NomeItem(nome[0], nome[1]);
        this.peso = peso;
        this.categoria = categoria;
    }
};

export class DadosGenericosAcao {
    public nome: string;
    public idTipoAcao: number;
    public idMecanica?: number;

    constructor({ nome, idTipoAcao, idMecanica }: { nome: string; idTipoAcao: number; idMecanica?: number }) {
        this.nome = nome;
        this.idTipoAcao = idTipoAcao;
        this.idMecanica = idMecanica;
    }
}

export type DadosGenericosAcaoParams = ConstructorParameters<typeof DadosGenericosAcao>[0];

export class DadosGenericosRitual {
    public nome: string;

    constructor({ nome }: { nome: string } ) {
        this.nome = nome;
    }
}

export class ComportamentoConsomeUso {
    constructor (
        public quantidadeUso: number,
    ) { }
}

export class ComportamentoConsomeMunicao {
    constructor (
        public nomeMunicao: string,
        public quantidadeUso: number,
    ) { }
}