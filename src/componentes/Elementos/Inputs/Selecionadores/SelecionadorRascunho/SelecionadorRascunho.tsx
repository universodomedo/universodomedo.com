'use client';

import styles from './styles.module.css';
import stylesBase from '../styles.module.css';

import { JSX, useMemo } from 'react';
import { components, type GroupBase, type OptionProps, type SingleValueProps } from 'react-select';
import cn from 'classnames';
import type { RascunhoCompletaDto } from 'types-nora-api';

import criarSelecionadorBase from '../SelecionadorBase';

export const VALOR_MUNDO_ABERTO = 'MUNDO_ABERTO' as const;

type IdSelecionadoRascunho = number | typeof VALOR_MUNDO_ABERTO;
type Option = { value: IdSelecionadoRascunho; label: string; id: IdSelecionadoRascunho; titulo: string };

const SelecionadorRascunhoBase = criarSelecionadorBase<Option, false>();

type SelecionadorRascunhoProps = {
    options: RascunhoCompletaDto[];
    idSelecionado?: IdSelecionadoRascunho | null;
    onSelectIdRascunho: (idRascunho: IdSelecionadoRascunho | null) => void;
    disabled?: boolean;
    isClearable?: boolean;
};

export default function SelecionadorRascunho(props: SelecionadorRascunhoProps): JSX.Element {
    const options = useMemo<Option[]>(() => {
        const listaRascunhos = (props.options || []).map((r) => ({ value: r.id, id: r.id, titulo: r.titulo, label: r.titulo }));
        listaRascunhos.sort((a, b) => a.id - b.id);
        return [{ value: VALOR_MUNDO_ABERTO, id: VALOR_MUNDO_ABERTO, titulo: 'Mundo Aberto', label: 'Mundo Aberto' }, ...listaRascunhos];
    }, [props.options]);

    const value = useMemo<Option | null>(() => {
        const id = props.idSelecionado ?? null;
        if (id === null) return null;
        return options.find((o) => o.id === id) ?? null;
    }, [options, props.idSelecionado]);

    function onChange(option: Option | null) { props.onSelectIdRascunho(option ? option.id : null); }

    return (
        <div className={`${stylesBase.recipiente_interno_selecionador} ${styles.recipiente_interno_selecionador_rascunho}`}>
            <SelecionadorRascunhoBase.Select className={stylesBase.select} classNamePrefix="rs" options={options} value={value} placeholder={'Selecione um rascunho...'} isClearable={props.isClearable ?? true} isDisabled={props.disabled === true} onChange={onChange} />
        </div>
    );
};

function renderOption(props: OptionProps<Option, false, GroupBase<Option>>) {
    return (
        <components.Option {...props}>
            <div className={cn(styles.option_texto, props.data.id === VALOR_MUNDO_ABERTO && styles.option_mundo_aberto)}>{props.data.titulo}</div>
        </components.Option>
    );
};

function renderSingleValue(props: SingleValueProps<Option, false, GroupBase<Option>>) {
    return (
        <components.SingleValue {...props}>
            <div className={styles.single_texto}>{props.data.titulo}</div>
        </components.SingleValue>
    );
};

SelecionadorRascunhoBase.Option = (props) => renderOption(props);
SelecionadorRascunhoBase.SingleValue = (props) => renderSingleValue(props);