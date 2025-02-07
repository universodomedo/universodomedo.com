export type TipoProficienciaModelo = {
    id: number;
    nome: string;
};

export type TipoProficiencia = TipoProficienciaModelo;

export type NivelProficienciaModelo = {
    nomeNivel: string;
    idTipoProficiencia: number;
    idNivelProficiencia: number;
};

export type NivelProficiencia = NivelProficienciaModelo;

export type Proficiencia = {
    idTipoProficiencia: number;
    idNivelProficiencia: number;
    readonly refTipoProficiencia: TipoProficiencia;
    readonly refNivelProficiencia: NivelProficiencia;
    readonly nomeExibicao: string;
};



// export class ProficienciaPersonagem {
//     public proficiencias: Proficiencia[] = [];

//     adicionaProficiencia(paramsProficiencias: ConstructorParameters<typeof Proficiencia>[0][]) {
//         paramsProficiencias.forEach(paramsProficiencia => {
//             this.proficiencias.push(new Proficiencia(paramsProficiencia));
//         });
//     }
// }

// export class Proficiencia {
//     private _idTipoProficiencia: number;
//     private _idNivelProficiencia: number;

//     constructor({ idTipoProficiencia, idNivelProficiencia }: { idTipoProficiencia: number, idNivelProficiencia: number }) {
//         this._idTipoProficiencia = idTipoProficiencia;
//         this._idNivelProficiencia = idNivelProficiencia;
//     }

//     get refTipoProficiencia(): TipoProficiencia { return SingletonHelper.getInstance().tipos_proficiencia.find(tipo_proficiencia => tipo_proficiencia.id === this._idTipoProficiencia)!; }
//     get refNivelProficiencia(): NivelProficiencia { return SingletonHelper.getInstance().niveis_proficiencia.find(nivel_proficiencia => nivel_proficiencia.idTipoProficiencia === this._idTipoProficiencia && nivel_proficiencia.idNivelProficiencia === this._idNivelProficiencia)!; }
//     get nomeExibicao(): string { return `Proficiência com ${this.refTipoProficiencia.nome} ${this.refNivelProficiencia.nomeNivel}`; }
// }

// export class TipoProficiencia {
//     constructor(
//         public id: number,
//         public nome: string,
//     ) { }
// }

// export class NivelProficiencia {
//     constructor(
//         public idTipoProficiencia: number,
//         public idNivelProficiencia: number,
//         public nomeNivel: string,
//     ) { }
// }