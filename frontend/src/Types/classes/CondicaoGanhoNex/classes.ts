// #region Imports
import React, { ReactNode } from "react";

import { CircleIcon, Cross1Icon, CheckIcon } from '@radix-ui/react-icons';
// #endregion

export type RegrasCondicaoGanhoNex = 'maior' | 'menor' | 'igual' | 'diferente';
export type OperadorCondicao = 'E' | 'OU';
export type CondicaoGanhoNexComOperador = { operador?: OperadorCondicao; condicoes: CondicaoGanhoNex[] };

export class CondicaoGanhoNex {
    constructor (
        public idOpcao: number,
        public regra: RegrasCondicaoGanhoNex,
        public valorCondicao: number,
    ) { }

    public validaCondicao(valorAVerificar: number): boolean {
        switch (this.regra) {
            case ('maior'):
                return valorAVerificar > this.valorCondicao;
            case ('menor'):
                return valorAVerificar < this.valorCondicao;
            case ('igual'):
                return valorAVerificar === this.valorCondicao;
            case ('diferente'):
                return valorAVerificar !== this.valorCondicao;
        }
    };
}

export class ValidacoesGanhoNex {
    constructor(
        public condicao: CondicaoGanhoNexComOperador,
        public mensagem: string,
    ) { }

    get invalido(): boolean { return !this.validaCondicao };

    get validaCondicao(): boolean {
        switch (this.condicao.operador) {
            case ('OU'):
                return this.condicao.condicoes.some((resultado) => resultado.validaCondicao());
            default:
                return this.condicao.condicoes.every((resultado) => resultado.validaCondicao());
        }
    };

    // return React.createElement(CircleIcon);
    get iconeValidacao(): ReactNode { return (this.validaCondicao ? React.createElement(CheckIcon) : React.createElement(Cross1Icon)) };
}

export type AvisoGanhoNex = {
    mensagem: string,
    icone: ReactNode
}