'use client';

import { useMemo, useState, type ChangeEvent } from 'react';

export type FormularioCreateValorCampo = string | null;

export type FormularioCreateCampoDef<TValor> = {
    readonly label: string;
    readonly tipo: 'text' | 'textarea' | 'checkbox';
    readonly obrigatorio?: boolean;
    readonly nullable?: boolean;
    readonly trim?: boolean;
    readonly maxLength?: number;
    readonly placeholder?: string;
    readonly valorVazio?: TValor;
};

export type FormularioCreateDef<TValores extends object> = {
    readonly campos: {
        readonly [TChave in keyof TValores]: FormularioCreateCampoDef<TValores[TChave]>;
    };
    readonly valoresIniciais: TValores;
};

export type FormularioCreateInputProps = {
    readonly value: string;
    readonly onChange: (evento: ChangeEvent<HTMLInputElement>) => void;
    readonly disabled: boolean;
    readonly maxLength?: number;
    readonly placeholder?: string;
};

export type FormularioCreateTextareaProps = {
    readonly value: string;
    readonly onChange: (evento: ChangeEvent<HTMLTextAreaElement>) => void;
    readonly disabled: boolean;
    readonly maxLength?: number;
    readonly placeholder?: string;
};

export type FormularioCreateCheckboxProps = {
    readonly checked: boolean;
    readonly onChange: (evento: ChangeEvent<HTMLInputElement>) => void;
    readonly disabled: boolean;
};

export type FormularioCreateEstado<TValores extends object> = {
    readonly valores: TValores;
    readonly erros: Partial<Record<keyof TValores, string>>;
    readonly salvando: boolean;
    readonly podeSalvar: boolean;
    readonly salvar: () => Promise<void>;
    readonly reset: () => void;
    readonly setCampo: <TChave extends keyof TValores>(campo: TChave, valor: TValores[TChave]) => void;
    readonly input: <TChave extends keyof TValores>(campo: TChave) => FormularioCreateInputProps;
    readonly textarea: <TChave extends keyof TValores>(campo: TChave) => FormularioCreateTextareaProps;
    readonly checkbox: <TChave extends keyof TValores>(campo: TChave) => FormularioCreateCheckboxProps;
    readonly erro: <TChave extends keyof TValores>(campo: TChave) => string | null;
};

export function defineFormularioCreate<TValores extends object>(definicao: FormularioCreateDef<TValores>): FormularioCreateDef<TValores> { return definicao; };

function obtemChavesFormulario<TValores extends object>(definicao: FormularioCreateDef<TValores>): (keyof TValores)[] { return Object.keys(definicao.campos) as (keyof TValores)[]; };

function valorCampoComoTexto(valor: FormularioCreateValorCampo): string {
    if (valor === null) return '';

    return valor;
};

function normalizaValorCampo<TValores extends object, TChave extends keyof TValores>(definicao: FormularioCreateDef<TValores>, campo: TChave, valor: string): TValores[TChave] {
    const campoDef = definicao.campos[campo];
    const texto = campoDef.trim === false ? valor : valor.trim();

    if (campoDef.nullable && texto.length < 1) return null as TValores[TChave];

    return texto as TValores[TChave];
};

function validaCampo<TValores extends object, TChave extends keyof TValores>(definicao: FormularioCreateDef<TValores>, campo: TChave, valor: TValores[TChave]): string | null {
    const campoDef = definicao.campos[campo];
    const valorNormalizado = typeof valor === 'string' ? normalizaValorCampo(definicao, campo, valor) : valor;
    const valorTexto = typeof valorNormalizado === 'string' ? valorNormalizado : '';

    if (campoDef.obrigatorio && valorNormalizado === null) return `${campoDef.label} é obrigatório.`;
    if (campoDef.obrigatorio && valorTexto.trim().length < 1) return `${campoDef.label} é obrigatório.`;
    if (campoDef.maxLength && valorTexto.length > campoDef.maxLength) return `${campoDef.label} deve ter no máximo ${campoDef.maxLength} caracteres.`;

    return null;
};

function montaValoresNormalizados<TValores extends object>(definicao: FormularioCreateDef<TValores>, valores: TValores): TValores {
    const chaves = obtemChavesFormulario(definicao);

    return chaves.reduce((acumulado, campo) => {
        const valor = valores[campo];

        return {
            ...acumulado,
            [campo]: typeof valor === 'string' ? normalizaValorCampo(definicao, campo, valor) : valor,
        };
    }, valores);
};

function montaErrosFormulario<TValores extends object>(definicao: FormularioCreateDef<TValores>, valores: TValores): Partial<Record<keyof TValores, string>> {
    const chaves = obtemChavesFormulario(definicao);

    return chaves.reduce<Partial<Record<keyof TValores, string>>>((erros, campo) => {
        const erro = validaCampo(definicao, campo, valores[campo]);

        if (!erro) return erros;

        return {
            ...erros,
            [campo]: erro,
        };
    }, {});
};

function formularioPossuiErros<TValores extends object>(definicao: FormularioCreateDef<TValores>, erros: Partial<Record<keyof TValores, string>>): boolean {
    return obtemChavesFormulario(definicao).some(campo => !!erros[campo]);
};

export default function useFormularioCreate<TValores extends object>(definicao: FormularioCreateDef<TValores>, onSubmit: (payload: TValores) => Promise<void> | void): FormularioCreateEstado<TValores> {
    const [valores, setValores] = useState<TValores>(definicao.valoresIniciais);
    const [salvando, setSalvando] = useState(false);

    const valoresNormalizados = useMemo(() => montaValoresNormalizados(definicao, valores), [definicao, valores]);
    const erros = useMemo(() => montaErrosFormulario(definicao, valoresNormalizados), [definicao, valoresNormalizados]);
    const podeSalvar = useMemo(() => !salvando && !formularioPossuiErros(definicao, erros), [definicao, erros, salvando]);

    function reset(): void { setValores(definicao.valoresIniciais); };

    function setCampo<TChave extends keyof TValores>(campo: TChave, valor: TValores[TChave]): void { setValores(valoresAtuais => ({ ...valoresAtuais, [campo]: valor })); };

    function input<TChave extends keyof TValores>(campo: TChave): FormularioCreateInputProps {
        const campoDef = definicao.campos[campo];

        return {
            value: valorCampoComoTexto(valores[campo] as FormularioCreateValorCampo),
            onChange: evento => setCampo(campo, evento.target.value as TValores[TChave]),
            disabled: salvando,
            maxLength: campoDef.maxLength,
            placeholder: campoDef.placeholder,
        };
    };

    function textarea<TChave extends keyof TValores>(campo: TChave): FormularioCreateTextareaProps {
        const campoDef = definicao.campos[campo];

        return {
            value: valorCampoComoTexto(valores[campo] as FormularioCreateValorCampo),
            onChange: evento => setCampo(campo, evento.target.value as TValores[TChave]),
            disabled: salvando,
            maxLength: campoDef.maxLength,
            placeholder: campoDef.placeholder,
        };
    };

    function checkbox<TChave extends keyof TValores>(campo: TChave): FormularioCreateCheckboxProps {
        return {
            checked: valores[campo] === true,
            onChange: evento => setCampo(campo, evento.target.checked as TValores[TChave]),
            disabled: salvando,
        };
    };

    function erro<TChave extends keyof TValores>(campo: TChave): string | null {
        return erros[campo] ?? null;
    };

    async function salvar(): Promise<void> {
        if (!podeSalvar) return;

        setSalvando(true);

        try {
            await onSubmit(valoresNormalizados);
        } finally {
            setSalvando(false);
        };
    };

    return { valores, erros, salvando, podeSalvar, salvar, reset, setCampo, input, textarea, checkbox, erro };
};