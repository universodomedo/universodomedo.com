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

//     get ehComponente(): boolean { return this.temComportamentoComponente; }

//     get podeGastarUsos(): boolean { return this.temComportamentoUtilizavel && this.comportamentoUtilizavel.usosMaximo > 0; }

//     temMunicaoSuficiente(nomeMunicao: string, quantidadeMunicao: number) { return !this.temComportamentoMunicao || this.comportamentoMunicao.verificaMunicao(nomeMunicao, quantidadeMunicao) }
// }

// class EmbrulhoComportamentoAcao {
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

//     get mensagemRequisitos(): string { return this.temComportamentoRequisito ? this.comportamentoRequisito.mensagemRequisitos : ''; }
//     get requisitosCumpridos(): boolean { return !this.temComportamentoRequisito || this.comportamentoRequisito.requisitosCumprido; }
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

// export class ComportamentoComponente {
//     constructor(
//         private _idElemento: number,
//         private _idNivelComponente: number,
//     ) { }

//     get refElemento(): Elemento { return SingletonHelper.getInstance().elementos.find(elemento => elemento.id === this._idElemento)!; }
//     get refNivelComponente(): NivelComponente { return SingletonHelper.getInstance().niveis_componente.find(nivel_componente => nivel_componente.id === this._idNivelComponente)!; }
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