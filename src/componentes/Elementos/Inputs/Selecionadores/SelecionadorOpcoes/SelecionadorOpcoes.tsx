'use client';

import stylesBase from '../styles.module.css';

import { JSX, useMemo } from 'react';
import { components, type GroupBase, type MultiValue, type MultiValueProps, type OnChangeValue, type OptionProps, type SingleValueProps } from 'react-select';

import criarSelecionadorBase from '../SelecionadorBase';

// Opção genérica de um dropdown simples: um valor string + o texto exibido.
export type OpcaoSelecionador = { value: string; label: string };

const SelecionadorOpcoesSingleBase = criarSelecionadorBase<OpcaoSelecionador, false>();
const SelecionadorOpcoesMultiBase = criarSelecionadorBase<OpcaoSelecionador, true>();

type PropsBase = { opcoes: readonly OpcaoSelecionador[]; placeholder?: string; disabled?: boolean; isClearable?: boolean };
type PropsSingle = PropsBase & { isMulti?: false; valor: string | null; onChange: (valor: string | null) => void };
type PropsMulti = PropsBase & { isMulti: true; valores: readonly string[]; onChange: (valores: string[]) => void };

// Dropdown genérico (react-select + estilo UDM) pra escolher 1 (single) ou N (isMulti) de uma lista de {value,label}.
export default function SelecionadorOpcoes(props: PropsSingle): JSX.Element;
export default function SelecionadorOpcoes(props: PropsMulti): JSX.Element;
export default function SelecionadorOpcoes(props: PropsSingle | PropsMulti) {
    const opcoes = props.opcoes as OpcaoSelecionador[];

    const valueSingle = useMemo<OpcaoSelecionador | null>(() => {
        if ('valores' in props) return null;
        return opcoes.find(opcao => opcao.value === props.valor) ?? null;
    }, [opcoes, props]);

    const valueMulti = useMemo<MultiValue<OpcaoSelecionador>>(() => {
        if ('valor' in props) return [];
        return opcoes.filter(opcao => props.valores.includes(opcao.value));
    }, [opcoes, props]);

    function onChangeSingle(opcao: OnChangeValue<OpcaoSelecionador, false>) { if ('valor' in props) props.onChange(opcao ? opcao.value : null); }

    function onChangeMulti(opcoesSelecionadas: OnChangeValue<OpcaoSelecionador, true>) { if ('valores' in props) props.onChange((opcoesSelecionadas as MultiValue<OpcaoSelecionador>).map(opcao => opcao.value)); }

    return (
        <div className={stylesBase.recipiente_interno_selecionador}>
            {props.isMulti ? (
                <SelecionadorOpcoesMultiBase.Select className={stylesBase.select} classNamePrefix="rs" options={opcoes} value={valueMulti} placeholder={props.placeholder ?? 'Selecione...'} isClearable={props.isClearable ?? true} isDisabled={props.disabled === true} onChange={onChangeMulti} isMulti />
            ) : (
                <SelecionadorOpcoesSingleBase.Select className={stylesBase.select} classNamePrefix="rs" options={opcoes} value={valueSingle} placeholder={props.placeholder ?? 'Selecione...'} isClearable={props.isClearable ?? false} isDisabled={props.disabled === true} onChange={onChangeSingle} />
            )}
        </div>
    );
};

function renderOption<IsMulti extends boolean>(props: OptionProps<OpcaoSelecionador, IsMulti, GroupBase<OpcaoSelecionador>>) {
    return <components.Option {...props}>{props.data.label}</components.Option>;
};

function renderSingleValue<IsMulti extends boolean>(props: SingleValueProps<OpcaoSelecionador, IsMulti, GroupBase<OpcaoSelecionador>>) {
    return <components.SingleValue {...props}>{props.data.label}</components.SingleValue>;
};

function renderMultiValue<IsMulti extends boolean>(props: MultiValueProps<OpcaoSelecionador, IsMulti, GroupBase<OpcaoSelecionador>>) {
    return <components.MultiValue {...props}>{props.data.label}</components.MultiValue>;
};

SelecionadorOpcoesSingleBase.Option = (props) => renderOption<false>(props);
SelecionadorOpcoesMultiBase.Option = (props) => renderOption<true>(props);
SelecionadorOpcoesSingleBase.SingleValue = (props) => renderSingleValue<false>(props);
SelecionadorOpcoesMultiBase.SingleValue = (props) => renderSingleValue<true>(props);
SelecionadorOpcoesMultiBase.MultiValue = (props) => renderMultiValue<true>(props);
