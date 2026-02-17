'use client';

import styles from './styles.module.css';
import stylesBase from '../styles.module.css';

import { useMemo } from 'react';
import { type SingleValue, components, type OptionProps, type SingleValueProps } from 'react-select';

import { DiaDaSemana, obtemDiaDaSemanaPorExtensoPorDDS } from 'types-nora-api';
import criarSelecionadorBase from '../SelecionadorBase';

type OptionDiaDaSemana = { value: DiaDaSemana; label: string; dds: DiaDaSemana };

const SelecionadorDiaDaSemanaBase = criarSelecionadorBase<OptionDiaDaSemana, false>();

export default function SelecionadorDiaDaSemana({ diaSelecionado, onSelectDiaDaSemana }: { diaSelecionado: DiaDaSemana; onSelectDiaDaSemana: (v: DiaDaSemana) => void }) {
    const options = useMemo<OptionDiaDaSemana[]>(() => {
        return Object.values(DiaDaSemana).filter((v): v is number => typeof v === 'number').map((dds) => {
            const dia = dds as DiaDaSemana;
            return { value: dia, dds: dia, label: obtemDiaDaSemanaPorExtensoPorDDS(dia) };
        });
    }, []);

    const value = useMemo(() => options.find((o) => o.dds === diaSelecionado) ?? null, [options, diaSelecionado]);

    function onChange(option: SingleValue<OptionDiaDaSemana>) {
        if (!option) return;
        onSelectDiaDaSemana(option.dds);
    }

    return (
        <div className={`${stylesBase.recipiente_interno_selecionador} ${styles.recipiente_interno_selecionador_dia_da_semana}`}>
            <SelecionadorDiaDaSemanaBase.Select
                className={stylesBase.select}
                classNamePrefix="rs"
                options={options}
                value={value}
                onChange={onChange}
                placeholder="Dia da semana..."
            />
        </div>
    );
};

SelecionadorDiaDaSemanaBase.Option = (props: OptionProps<OptionDiaDaSemana, false>) => {
    const data = props.data;

    return (
        <components.Option {...props}>
            <div className={styles.option_row}>
                <div className={styles.option_label}>{data.label}</div>
            </div>
        </components.Option>
    );
};

SelecionadorDiaDaSemanaBase.SingleValue = (props: SingleValueProps<OptionDiaDaSemana, false>) => {
    const data = props.data;

    return (
        <components.SingleValue {...props}>
            <div className={styles.single_row}>
                <div className={styles.single_label}>{data.label}</div>
            </div>
        </components.SingleValue>
    );
};