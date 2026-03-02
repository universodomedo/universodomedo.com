'use client';

import styles from './styles.module.css';
import stylesBase from '../styles.module.css';

import { JSX, useMemo } from 'react';
import { components, type GroupBase, type OptionProps, type SingleValueProps } from 'react-select';
import { type FichaTemporariaDto } from 'types-nora-api';

import criarSelecionadorBase from '../SelecionadorBase';

type Option = { value: number; id: number; titulo: string };

const SelecionadorFichaTemporariaBase = criarSelecionadorBase<Option, false>();

type SelecionadorFichaTemporariaProps = {
    options: FichaTemporariaDto[];
    idSelecionado?: number | null;
    onSelectIdFicha: (idFicha: number | null) => void;
    disabled?: boolean;
    isClearable?: boolean;
};

export default function SelecionadorFichaTemporaria(props: SelecionadorFichaTemporariaProps): JSX.Element {
    const options = useMemo<Option[]>(() => {
        const listaFichas = (props.options || []).map((f) => ({ value: f.id, id: f.id, titulo: f.nome }));
        listaFichas.sort((a, b) => a.id - b.id);
        return listaFichas;
    }, [props.options]);

    const value = useMemo<Option | null>(() => {
        const id = props.idSelecionado ?? null;
        if (id === null) return null;
        return options.find((o) => o.id === id) ?? null;
    }, [options, props.idSelecionado]);

    function onChange(option: Option | null) { props.onSelectIdFicha(option ? option.id : null); }

    return (
        <div className={`${stylesBase.recipiente_interno_selecionador} ${styles.recipiente_interno_selecionador_ficha}`}>
            <SelecionadorFichaTemporariaBase.Select className={stylesBase.select} classNamePrefix="rs" options={options} value={value} placeholder={'Selecione uma ficha...'} isClearable={props.isClearable ?? true} isDisabled={props.disabled === true} onChange={onChange} />
        </div>
    );
}

function renderOption(props: OptionProps<Option, false, GroupBase<Option>>) {
    return (
        <components.Option {...props}>
            <div className={styles.option_texto}>{props.data.titulo}</div>
        </components.Option>
    );
}

function renderSingleValue(props: SingleValueProps<Option, false, GroupBase<Option>>) {
    return (
        <components.SingleValue {...props}>
            <div className={styles.single_texto}>{props.data.titulo}</div>
        </components.SingleValue>
    );
}

SelecionadorFichaTemporariaBase.Option = (props) => renderOption(props);
SelecionadorFichaTemporariaBase.SingleValue = (props) => renderSingleValue(props);