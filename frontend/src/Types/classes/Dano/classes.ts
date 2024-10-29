// #region Imports
import { Personagem } from 'Types/classes/index.ts';
import { MDL_TipoDano } from 'udm-types';
// #endregion



// aqui ta tudo errado, super velho


export class ReducaoDano {
    constructor(
        public valor: number,
        public tipoDano: MDL_TipoDano,
        private refPersonagem: Personagem
    ) { }

    get valorBonus(): number {
        // return this.refPersonagem.buffs.filter(buff => buff.refBuff.id === this.tipoDano.idBuff).reduce((acc, cur) => {
        //     return acc + cur.valor;
        // }, 0);

        return 0;
    }

    get valorTotal(): number {
        return this.valor + this.valorBonus;
    }
}

export class DanoGeral { // traduz em 1 unico ataque
    public listaDano: InstanciaDano[]; // são as diferentes composições dentro desse unico ataque

    constructor(listaDano: InstanciaDano[]) {
        this.listaDano = listaDano;
    }
}

export class InstanciaDano {
    public valor: number;
    public tipoDano: TipoDano;

    constructor(valor: number, tipoDano: TipoDano) {
        this.valor = valor;
        this.tipoDano = tipoDano;
    }
}

export class ReducaoDanoa {
    public tipo: TipoDano;
    public valor: number;

    constructor(tipo: TipoDano, valor: number) {
        this.tipo = tipo;
        this.valor = valor;
    }
}

// export class TipoDano {
//     public id:number;
//     public nome:string;
//     public danoPertencente?:TipoDano;
//     // estatistica alvo

//     constructor(id:number, nome:string) {
//         this.id = id;
//         this.nome = nome;
//     }
// }

export class TipoDano {
    constructor(
        public id: number,
        public nome: string,
    ) { }
}