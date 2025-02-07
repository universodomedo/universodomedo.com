// // #region Imports
// import { useClasseContextualPersonagemEstatisticasBuffaveis } from 'Classes/ClassesContextuais/PersonagemEstatisticasBuffaveis';
// import { Atributo, AtributoPersonagem, CirculoNivelRitual, Custo, CustoComponente, CustoExecucao, CustoPE, DificuldadeDinamica, Elemento, Extremidade, GastaCustoProps, NivelComponente, NomeItem, Pericia, PrecoExecucao, Proficiencia } from 'Classes/ClassesTipos/index.ts';
// import { SingletonHelper } from 'Classes/classes_estaticas.ts';

// import { getPersonagemFromContext } from 'Contextos/ContextoPersonagem/contexto.tsx';
// import { ValorGenerico } from 'Uteis/uteis.tsx';
// // #endregion



export class ComportamentosModificador {
    private _comportamentoModificadorAtivo?: ComportamentoModificadorAtivo;
    get temComportamentoModificadorAtivo(): boolean { return Boolean(this._comportamentoModificadorAtivo); }
    setComportamentoModificadorAtivo(...args: ConstructorParameters<typeof ComportamentoModificadorAtivo>): void { this._comportamentoModificadorAtivo = new ComportamentoModificadorAtivo(...args); }

    private _comportamentoPassivo?: ComportamentoModificadorPassivo;
    get temComportamentoModificadorPassivo(): boolean { return Boolean(this._comportamentoPassivo); }
    setComportamentoModificadorPassivo(...args: ConstructorParameters<typeof ComportamentoModificadorPassivo>): void { this._comportamentoPassivo = new ComportamentoModificadorPassivo(...args); }

    get ehPassivoSempreAtivo(): boolean { return this.temComportamentoModificadorPassivo && (!this._comportamentoPassivo!.precisaEstarEmpunhando && !this._comportamentoPassivo!.precisaEstarVestindo) }
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






























// export class ComportamentosAcao {
//     // precisaMunica
//     // nomeMunicao
//     // usosMunicao
// }

// export class EmbrulhoComportamentoItem {
//     private _comportamentoEmpunhavel?: ComportamentoEmpunhavel;
//     get temComportamentoEmpunhavel(): boolean { return Boolean(this._comportamentoEmpunhavel); }
//     get comportamentoEmpunhavel(): ComportamentoEmpunhavel { return this._comportamentoEmpunhavel!; } // sempre verificar se temComportamentoEmpunhavel antes
//     setComportamentoEmpunhavel(...args: ConstructorParameters<typeof ComportamentoEmpunhavel>): void { this._comportamentoEmpunhavel = new ComportamentoEmpunhavel(...args); }

//     private _comportamentoVestivel?: ComportamentoVestivel;
//     get temComportamentoVestivel(): boolean { return Boolean(this._comportamentoVestivel); }
//     get comportamentoVestivel(): ComportamentoVestivel { return this._comportamentoVestivel!; } // sempre verificar se temComportamentoVestivel antes
//     setComportamentoVestivel(...args: ConstructorParameters<typeof ComportamentoVestivel>): void { this._comportamentoVestivel = new ComportamentoVestivel(...args); }

//     private _comportamentoComponente?: ComportamentoComponente;
//     get temComportamentoComponente(): boolean { return Boolean(this._comportamentoComponente); }
//     get comportamentoComponente(): ComportamentoComponente { return this._comportamentoComponente!; } // sempre verificar se temComportamentoComponente antes
//     setComportamentoComponente(...args: ConstructorParameters<typeof ComportamentoComponente>): void { this._comportamentoComponente = new ComportamentoComponente(...args); }

//     private _comportamentoUtilizavel?: ComportamentoUtilizavel;
//     get temComportamentoUtilizavel(): boolean { return Boolean(this._comportamentoUtilizavel); }
//     get comportamentoUtilizavel(): ComportamentoUtilizavel { return this._comportamentoUtilizavel!; } // sempre verificar se temComportamentoUtilizavel antes
//     setComportamentoUtilizavel(...args: ConstructorParameters<typeof ComportamentoUtilizavel>): void { this._comportamentoUtilizavel = new ComportamentoUtilizavel(...args); }

//     private _comportamentoMunicao?: ComportamentoMunicao;
//     get temComportamentoMunicao(): boolean { return Boolean(this._comportamentoMunicao); }
//     get comportamentoMunicao(): ComportamentoMunicao { return this._comportamentoMunicao!; } // sempre verificar se temComportamentoMunicao antes
//     setComportamentoMunicao(...args: ConstructorParameters<typeof RequisitoMunicao>[]): void { this._comportamentoMunicao = new ComportamentoMunicao(args); }

//     get custosParaSacarValidos(): boolean { return this.comportamentoEmpunhavel.extremidadeLivresSuficiente && this.comportamentoEmpunhavel.execucoesSuficientes; }
//     get mensagemExecucoesUsadasParaSacar(): string { return this.comportamentoEmpunhavel.mensagemExecucoesUsadasParaSacar; }

//     get podeSerEmpunhado(): boolean { return this.temComportamentoEmpunhavel && this.comportamentoEmpunhavel.podeSerEmpunhado; }
//     get podeSerVestido(): boolean { return this.temComportamentoVestivel && this.comportamentoVestivel.podeSerVestido; }

//     get estaEmpunhado(): boolean { return this.podeSerEmpunhado && this.comportamentoEmpunhavel.estaEmpunhado }
//     get estaVestido(): boolean { return this.podeSerVestido && this.comportamentoVestivel.estaVestido }

//     get ehComponente(): boolean { return this.temComportamentoComponente; }

//     get podeGastarUsos(): boolean { return this.temComportamentoUtilizavel && this.comportamentoUtilizavel.usosMaximo > 0; }

//     temMunicaoSuficiente(nomeMunicao: string, quantidadeMunicao: number) { return !this.temComportamentoMunicao || this.comportamentoMunicao.verificaMunicao(nomeMunicao, quantidadeMunicao) }
// }

// export class EmbrulhoComportamentoAcao {
//     public comportamentoTrava: ComportamentoAcaoTrava = new ComportamentoAcaoTrava();
//     public comportamentoHistoricoAcao: ComportamentoHistoricoAcao = new ComportamentoHistoricoAcao();

//     public comportamentoCustoAcao: ComportamentoCustoAcao = new ComportamentoCustoAcao();
//     setComportamentoCustoAcao(args: ConstructorParameters<typeof ComportamentoCustoAcao>[0]): void { this.comportamentoCustoAcao = new ComportamentoCustoAcao(args); }

//     private _comportamentoDificuldadeAcao?: ComportamentoDificuldadeAcao;
//     get temComportamentoDificuldadeAcao(): boolean { return Boolean(this._comportamentoDificuldadeAcao); }
//     get comportamentoDificuldadeAcao(): ComportamentoDificuldadeAcao { return this._comportamentoDificuldadeAcao!; } // sempre verificar se temComportamentoDificuldadeAcao antes
//     setComportamentoDificuldadeAcao(...args: ConstructorParameters<typeof ComportamentoDificuldadeAcao>): void { this._comportamentoDificuldadeAcao = new ComportamentoDificuldadeAcao(...args); }

//     private _comportamentoAcao?: ComportamentoAcao;
//     get temComportamentoAcao(): boolean { return Boolean(this._comportamentoAcao); }
//     get comportamentoAcao(): ComportamentoAcao { return this._comportamentoAcao!; } // sempre verificar se temComportamentoAcao antes
//     setComportamentoAcao(...args: ConstructorParameters<typeof ComportamentoAcao>): void { this._comportamentoAcao = new ComportamentoAcao(...args); }

//     private _comportamentoRequisito?: ComportamentoRequisito;
//     get temComportamentoRequisito(): boolean { return Boolean(this._comportamentoRequisito); }
//     get comportamentoRequisito(): ComportamentoRequisito { return this._comportamentoRequisito!; } // sempre verificar se temComportamentoRequisito antes
//     setComportamentoRequisito(args: ConstructorParameters<typeof RequisitoUso>[0][]): void { this._comportamentoRequisito = new ComportamentoRequisito(args); }

//     private _comportamentoConsomeUso?: ComportamentoConsomeUso;
//     get temComportamentoConsomeUso(): boolean { return Boolean(this._comportamentoConsomeUso); }
//     get comportamentoConsomeUso(): ComportamentoConsomeUso { return this._comportamentoConsomeUso!; } // sempre verificar se temComportamentoConsomeUso antes
//     setComportamentoConsomeUso(...args: ConstructorParameters<typeof ComportamentoConsomeUso>): void { this._comportamentoConsomeUso = new ComportamentoConsomeUso(...args); }

//     private _comportamentoConsomeMunicao?: ComportamentoConsomeMunicao;
//     get temComportamentoConsomeMunicao(): boolean { return Boolean(this._comportamentoConsomeMunicao); }
//     get comportamentoConsomeMunicao(): ComportamentoConsomeMunicao { return this._comportamentoConsomeMunicao!; } // sempre verificar se temComportamentoConsomeMunicao antes
//     setComportamentoConsomeMunicao(...args: ConstructorParameters<typeof ComportamentoConsomeMunicao>): void { this._comportamentoConsomeMunicao = new ComportamentoConsomeMunicao(...args); }


//     get acaoTravada(): boolean { return this.comportamentoTrava.trava; }
//     travaAcao() { this.comportamentoTrava.travaAcao('Você falhou'); }

//     get listaCustos(): Custo[] { return this.comportamentoCustoAcao.listaCustos; }
//     get custosPodemSerPagos(): boolean { return this.comportamentoCustoAcao.custosPodemSerPagos; }

//     get temDificuldadeDeExecucao(): boolean { return this.temComportamentoDificuldadeAcao; }
//     get ehDificuldadeDinamica(): boolean { return this.temDificuldadeDeExecucao && this.comportamentoDificuldadeAcao.temDificuldadeDinamica; }
//     get dificuldadeDeExecucao(): number { return this.comportamentoDificuldadeAcao.dificuldadeDinamica!.dificuldadeAtual; } // sempre verificar se ehDificuldadeDinamica antes
//     atualizaDificuldadeDeExecucao(): void { this.comportamentoDificuldadeAcao.dificuldadeDinamica!.atualizaDificuldade(); }

//     get mensagemRequisitos(): string { return this.temComportamentoRequisito ? this.comportamentoRequisito.mensagemRequisitos : ''; }
//     get requisitosCumpridos(): boolean { return !this.temComportamentoRequisito || this.comportamentoRequisito.requisitosCumprido; }
// }

// export class EmbrulhoComportamentoRitual {
//     public comportamentoDescontosRitual = new ComportamentoDescontosRitual();
//     public comportamentoRitual: ComportamentoRitual;

//     constructor({ dadosComportamentoRitual }: { dadosComportamentoRitual: ConstructorParameters<typeof ComportamentoRitual>[0] }) {
//         this.comportamentoRitual = new ComportamentoRitual(dadosComportamentoRitual);
//     }
// }

// export class EmbrulhoComportamentoHabilidade {

// }

// export class ComportamentoUtilizavel {
//     public usosAtuais: number = 0;

//     constructor(public usosMaximo: number = 0, usosAtuais?: number) {
//         this.usosAtuais = (usosAtuais === undefined ? this.usosMaximo : usosAtuais);
//     }

//     gastaUsoERetornaSePrecisaRemover(): boolean {
//         // se não tem maximo, nunca consome, nunca remove
//         if (this.usosMaximo <= 0) return false;

//         this.usosAtuais--;
//         // se for 0 ou menor, retorna que o item deve ser removido
//         return this.usosAtuais <= 0;
//     }
// }

// export class ComportamentoEmpunhavel {
//     public refExtremidades: Extremidade[] = [];

//     constructor(public podeSerEmpunhado: boolean = true, public extremidadesNecessarias: number = 1) { }

//     get precoParaSacarOuGuardar(): CustoExecucao { return new CustoExecucao({ precoExecucao: { precos: [{ idTipoExecucao: 3, quantidadeExecucoes: 1 }] } }); }

//     get estaEmpunhado(): boolean { return this.refExtremidades.length === this.extremidadesNecessarias; }

//     get extremidadeLivresSuficiente(): boolean {
//         const { extremidades } = useClasseContextualPersonagemEstatisticasBuffaveis();
//         return this.extremidadesNecessarias <= extremidades.filter(extremidade => !extremidade.estaOcupada).length
//     }
//     get execucoesSuficientes(): boolean { return this.precoParaSacarOuGuardar.podeSerPago; }
//     get mensagemExecucoesUsadasParaSacar(): string { return this.precoParaSacarOuGuardar.precoExecucao.resumoPagamento; }

//     empunha(idItem: number): void {
//         const { extremidades } = useClasseContextualPersonagemEstatisticasBuffaveis();
//         this.refExtremidades = extremidades.filter(extremidade => !extremidade.estaOcupada).slice(0, this.extremidadesNecessarias);
//         this.refExtremidades.forEach(extremidade => extremidade.empunhar(idItem));
//     }

//     desempunha(): void {
//         this.esvaziaExtremidades();
//         this.refExtremidades = [];
//     }

//     esvaziaExtremidades(): void { this.refExtremidades.forEach(extremidade => extremidade.guardar()); }
// }

// export class ComportamentoVestivel {
//     private _estaVestido: boolean = false;

//     constructor(public podeSerVestido: boolean = false) { }

//     get precoParaVestirOuDesvestir(): PrecoExecucao { return new PrecoExecucao({ precos: [{ idTipoExecucao: 2, quantidadeExecucoes: 1 }] }); }

//     get estaVestido(): boolean { return this._estaVestido; }

//     veste(): void { if (this.podeSerVestido) this._estaVestido = true; }
//     desveste(): void { if (this.podeSerVestido) this._estaVestido = false; }
// }

// export class ComportamentoComponente {
//     constructor(
//         private _idElemento: number,
//         private _idNivelComponente: number,
//     ) { }

//     get refElemento(): Elemento { return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === this._idElemento)!; }
//     get refNivelComponente(): NivelComponente { return SingletonHelper.getInstance().niveis_componente.find(nivel_componente => nivel_componente.id === this._idNivelComponente)!; }
// }

// export class ComportamentoCustoAcao {
//     public custoExecucao: CustoExecucao;
//     public custoPE?: CustoPE;
//     public custoComponente?: CustoComponente;

//     constructor({ custoExecucao, custoPE, custoComponente }: { custoExecucao?: ConstructorParameters<typeof CustoExecucao>[0], custoPE?: ConstructorParameters<typeof CustoPE>[0], custoComponente?: ConstructorParameters<typeof CustoComponente>[0] } = {}) {
//         this.custoExecucao = new CustoExecucao(custoExecucao ?? { precoExecucao: { precos: [{ idTipoExecucao: 1, quantidadeExecucoes: 0 }] } });
//         if (custoPE !== undefined) this.custoPE = new CustoPE(custoPE);
//         if (custoComponente !== undefined && custoComponente) this.custoComponente = new CustoComponente(custoComponente);
//     }

//     get temCustoExecucao(): boolean { return this.custoExecucao !== undefined }
//     get temCustoPE(): boolean { return this.custoPE !== undefined }
//     get temCustoComponente(): boolean { return this.custoComponente !== undefined }
//     get listaCustos(): Custo[] {
//         const custos: Custo[] = [];

//         if (this.temCustoExecucao) custos.push(this.custoExecucao);
//         if (this.temCustoPE) custos.push(this.custoPE!);
//         if (this.temCustoComponente) custos.push(this.custoComponente!);

//         return custos;
//     }

//     get custosPodemSerPagos(): boolean { return this.listaCustos.every(custo => custo.podeSerPago); }

//     aplicarCustos(props: GastaCustoProps) {
//         this.listaCustos.map(custo => custo.gastaCusto(props))
//     }
// }

// export class ComportamentoHistoricoAcao {
//     public vezesUsadoCena: number = 0;
//     public vezesUsadoTurno: number = 0;

//     resetUsosCena() { this.vezesUsadoCena = 0; }
//     resetUsosTurno() { this.vezesUsadoTurno = 0; }
// }

// export class ComportamentoAcaoTrava {
//     public trava: boolean = false;
//     public descricaoTrava: string = '';

//     travaAcao(descricao: string) { this.trava = true; this.descricaoTrava = descricao; }
//     destravaAcao() { this.trava = false; this.descricaoTrava = ''; }
// }

// export class ComportamentoDificuldadeAcao {
//     public idAtributo: number;
//     public idPericia: number;
//     public dificuldadeDinamica?: DificuldadeDinamica;

//     constructor({ dadosTeste, dadosDificuldadeDinamica }: { dadosTeste: { idAtributo: number, idPericia: number }, dadosDificuldadeDinamica?: ConstructorParameters<typeof DificuldadeDinamica>[0] }) {
//         this.idPericia = dadosTeste.idPericia;
//         this.idAtributo = dadosTeste.idAtributo;

//         if (dadosDificuldadeDinamica) this.dificuldadeDinamica = new DificuldadeDinamica(dadosDificuldadeDinamica);
//     }

//     get refPericia(): Pericia { return SingletonHelper.getInstance().pericias.find(pericia => pericia.id === this.idPericia)!; }
//     get refAtributo(): Atributo { return SingletonHelper.getInstance().atributos.find(atributo => atributo.id === this.idAtributo)!; }

//     get temDificuldadeDinamica(): boolean { return this.dificuldadeDinamica !== undefined; }
// }

// export class ComportamentoAcao {
//     public tipo: 'Dano' | 'Cura';
//     public valorGenerico: ValorGenerico;

//     constructor({ tipo, paramsValorGenerico }: { tipo: 'Dano' | 'Cura', paramsValorGenerico: ConstructorParameters<typeof ValorGenerico>[0] }) {
//         this.tipo = tipo;
//         this.valorGenerico = new ValorGenerico(paramsValorGenerico);
//     }
// }

// export type OpcionaisComportamentoAcao = {
//     consomeUso?: { nomeUtilizavel: string },
//     consomeMunicao?: { nomeMunicao: string, quantidadePorUso: number },
// }

// export class ComportamentoRitual {
//     private _idElemento: number;
//     private _idCirculoNivel: number;

//     constructor({ idElemento, idCirculoNivel }: { idElemento: number, idCirculoNivel: number }) {
//         this._idElemento = idElemento;
//         this._idCirculoNivel = idCirculoNivel;
//     }

//     get refElemento(): Elemento { return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === this._idElemento)!; }
//     get refCirculoNivelRitual(): CirculoNivelRitual { return SingletonHelper.getInstance().circulos_niveis_ritual.find(circulo_nivel_ritual => circulo_nivel_ritual.id === this._idCirculoNivel)!; }
//     get refNivelComponente(): NivelComponente { return SingletonHelper.getInstance().niveis_componente.find(nivel_componente => nivel_componente.id === this.refCirculoNivelRitual.idCirculo)! }
// }

// export class ComportamentoDescontosRitual {
//     constructor(

//     ) { }

//     get valorDesconto(): number { return getPersonagemFromContext().obtemValorTotalComLinhaEfeito(0, 62); }
// }

// export class ComportamentoRequisito {
//     public requisitos: RequisitoUso[];

//     constructor(
//         dadosRequisitos: ConstructorParameters<typeof RequisitoUso>[0][]
//     ) {
//         this.requisitos = dadosRequisitos.map(dadosRequisito => new RequisitoUso(dadosRequisito));
//     }

//     get requisitosCumprido(): boolean { return this.requisitos.every(requisito => requisito.requisitoCumprido); }
//     get mensagemRequisitos(): string { return this.requisitos.length > 0 ? `${this.requisitos.map(requisito => requisito.mensagemRequisito).join(' e ')}` : ''; }
// }

// export class RequisitoUso {
//     public requisitoProficiencia: Proficiencia;

//     constructor({ paramsProficiencia }: { paramsProficiencia: ConstructorParameters<typeof Proficiencia>[0] }) {
//         this.requisitoProficiencia = new Proficiencia(paramsProficiencia);
//     }

//     get requisitoCumprido(): boolean { return getPersonagemFromContext().proficienciaPersonagem.proficiencias.some(proficiencia => proficiencia.refTipoProficiencia.id === this.requisitoProficiencia.refTipoProficiencia.id && proficiencia.refNivelProficiencia.idNivelProficiencia === this.requisitoProficiencia.refNivelProficiencia.idNivelProficiencia); }
//     get mensagemRequisito(): string { return this.requisitoProficiencia.nomeExibicao; }
// }

// export class ComportamentoMunicao {
//     public municoes: RequisitoMunicao[];

//     constructor(
//         dadosMunicoes: ConstructorParameters<typeof RequisitoMunicao>[]
//     ) {
//         this.municoes = dadosMunicoes.map(dadosMunicao => new RequisitoMunicao(...dadosMunicao));
//     }

//     verificaMunicao(nomeMunicao: string, quantidadeMunicao: number): boolean {
//         const municao = this.municoes.find(m => m.nome === nomeMunicao);
//         return (!municao ? false : municao.quantidadeAtual >= quantidadeMunicao)
//     }
// }

// export class RequisitoMunicao {
//     public quantidadeAtual: number = 0;

//     constructor(
//         public nome: string,
//         public capacidadeMaxima: number,
//     ) {
//         this.quantidadeAtual = this.capacidadeMaxima;
//     }
// }

// export class DadosGenericosItem {
//     public idTipoItem: number;
//     public nome: NomeItem;
//     public peso: number;
//     public categoria: number;

//     constructor({ idTipoItem, nome, peso, categoria }: { idTipoItem: number; nome: ConstructorParameters<typeof NomeItem>; peso: number; categoria: number; }) {
//         this.idTipoItem = idTipoItem;
//         this.nome = new NomeItem(nome[0], nome[1]);
//         this.peso = peso;
//         this.categoria = categoria;
//     }
// };

// export class DadosGenericosAcao {
//     public nome: string;
//     public idTipoAcao: number;
//     public idMecanica?: number;

//     constructor({ nome, idTipoAcao, idMecanica }: { nome: string; idTipoAcao: number; idMecanica?: number }) {
//         this.nome = nome;
//         this.idTipoAcao = idTipoAcao;
//         this.idMecanica = idMecanica;
//     }
// }

// export type DadosGenericosAcaoParams = ConstructorParameters<typeof DadosGenericosAcao>[0];


// export class DadosGenericosHabilidade {
//     public nome: string;
//     public descricao: string;

//     constructor({ nome, descricao }: { nome: string, descricao: string }) {
//         this.nome = nome;
//         this.descricao = descricao;
//     }
// }

// export type DadosGenericosHabilidadeParams = ConstructorParameters<typeof DadosGenericosHabilidade>[0];

// export class ComportamentoConsomeUso {
//     constructor(
//         public quantidadeUso: number,
//     ) { }
// }

// export class ComportamentoConsomeMunicao {
//     constructor(
//         public nomeMunicao: string,
//         public quantidadeUso: number,
//     ) { }
// }