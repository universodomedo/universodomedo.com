'use client';

import { FormEvent } from 'react';

import styles from './styles.module.css';

export type ListagemCompostaInputMode = 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';

export type ListagemCompostaControleTextoProps = {
    readonly id: string;
    readonly label: string;
    readonly valor: string;
    readonly placeholder?: string;
    readonly inputMode?: ListagemCompostaInputMode;
    readonly aoAlterarValor: (valor: string) => void;
};

export type ListagemCompostaFormularioBuscaProps = ListagemCompostaControleTextoProps & {
    readonly textoBotao: string;
    readonly textoBotaoLimpar?: string;
    readonly aoSubmeter: (event: FormEvent<HTMLFormElement>) => void;
    readonly aoLimpar?: () => void;
};

function deveMostrarBotaoLimpar(props: ListagemCompostaFormularioBuscaProps): boolean {
    return !!props.textoBotaoLimpar && !!props.aoLimpar;
};

export function ListagemCompostaControleTexto(props: ListagemCompostaControleTextoProps) {
    return (
        <div className={styles.controle_texto}>
            <label htmlFor={props.id}>{props.label}</label>
            <input id={props.id} value={props.valor} onChange={event => props.aoAlterarValor(event.target.value)} placeholder={props.placeholder} inputMode={props.inputMode} />
        </div>
    );
};

export function ListagemCompostaFormularioBusca(props: ListagemCompostaFormularioBuscaProps) {
    return (
        <form onSubmit={props.aoSubmeter} className={styles.controle_texto}>
            <label htmlFor={props.id}>{props.label}</label>
            <input id={props.id} value={props.valor} onChange={event => props.aoAlterarValor(event.target.value)} placeholder={props.placeholder} inputMode={props.inputMode} />
            <button type="submit">{props.textoBotao}</button>
            {deveMostrarBotaoLimpar(props) && <button type="button" onClick={props.aoLimpar}>{props.textoBotaoLimpar}</button>}
        </form>
    );
};