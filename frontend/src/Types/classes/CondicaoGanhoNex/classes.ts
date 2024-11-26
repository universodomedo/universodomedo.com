// #region Imports
import React, { ReactNode } from "react";

import { Cross1Icon, CheckIcon } from '@radix-ui/react-icons';
// #endregion

export type RegrasCondicaoGanhoNex = 'maior' | 'menor' | 'igual' | 'diferente';
export type OperadorCondicao = 'E' | 'OU';
export type CondicaoGanhoNexComOperador = { operador?: OperadorCondicao; condicoes: CondicaoGanhoNex[] };

export class CondicaoGanhoNex {
    private _valido:boolean = false;

    constructor (
        public idOpcao: number,
        public regra: RegrasCondicaoGanhoNex,
        public valorCondicao: number,
    ) { }

    public validaCondicao(valorAVerificar: number): void {
        let valido = this._valido;

        switch (this.regra) {
            case ('maior'):
                console.log(`verificando se ${valorAVerificar} maior ${this.valorCondicao}`);
                valido = valorAVerificar > this.valorCondicao;
                break;
            case ('menor'):
                console.log(`verificando se ${valorAVerificar} menor ${this.valorCondicao}`);
                valido = valorAVerificar < this.valorCondicao;
                break;
            case ('igual'):
                console.log(`verificando se ${valorAVerificar} igual ${this.valorCondicao}`);
                valido = valorAVerificar === this.valorCondicao;
                break;
            case ('diferente'):
                console.log(`verificando se ${valorAVerificar} diferente ${this.valorCondicao}`);
                valido = valorAVerificar !== this.valorCondicao;
                break;
        }

        this._valido = valido;
    };

    get valido():boolean { return this._valido };
}

export class ValidacoesGanhoNex {
    constructor(
        public condicao: CondicaoGanhoNexComOperador,
        public mensagem?: string,
    ) { }

    get valido():boolean {
        switch (this.condicao.operador) {
            case ('OU'):
                return this.condicao.condicoes.some(condicao => condicao.valido);
            default:
                return this.condicao.condicoes.every(condicao => condicao.valido);
        }
    };

    get iconeValidacao(): ReactNode { return (this.valido ? React.createElement(CheckIcon, { style: { color: '#38F938' } }) : React.createElement(Cross1Icon, { style: { color: '#FF0000' } })) };
}

export type AvisoGanhoNex = {
    mensagem: string,
    icone: ReactNode
}