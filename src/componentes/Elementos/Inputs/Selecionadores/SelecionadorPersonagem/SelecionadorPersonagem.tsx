'use client';

import styles from './styles.module.css';
import stylesBase from '../styles.module.css';

import { JSX, useMemo } from 'react';
import { components, type GroupBase, type OptionProps, type SingleValueProps } from 'react-select';
import type { PersonagemDto } from 'types-nora-api';

import criarSelecionadorBase from '../SelecionadorBase';
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';

type Option = { value: number; label: string; id: number; nome: string; caminhoAvatar: string };

const SelecionadorPersonagemBase = criarSelecionadorBase<Option, false>();

type SelecionadorPersonagemProps = {
    options: PersonagemDto[];
    idSelecionado?: number | null;
    onSelectIdPersonagem: (idPersonagem: number | null) => void;
    disabled?: boolean;
    isClearable?: boolean;
    placeholder?: string;
};

export default function SelecionadorPersonagem(props: SelecionadorPersonagemProps): JSX.Element {
    const options = useMemo<Option[]>(() => {
        const lista = (props.options || []).map(personagem => ({ value: personagem.id, id: personagem.id, nome: personagem.informacao.nome, caminhoAvatar: personagem.caminhoAvatar, label: `${personagem.informacao.nome} ${personagem.id}` }));
        lista.sort((a, b) => a.id - b.id);
        return lista;
    }, [props.options]);

    const value = useMemo<Option | null>(() => {
        const id = props.idSelecionado ?? null;
        if (id === null) return null;
        return options.find(option => option.id === id) ?? null;
    }, [options, props.idSelecionado]);

    function onChange(option: Option | null) { props.onSelectIdPersonagem(option ? option.id : null); }

    return (
        <div className={`${stylesBase.recipiente_interno_selecionador} ${styles.recipiente_interno_selecionador_personagem}`}>
            <SelecionadorPersonagemBase.Select className={stylesBase.select} classNamePrefix="rs" options={options} value={value} placeholder={props.placeholder ?? 'Selecione um personagem...'} isClearable={props.isClearable ?? true} isDisabled={props.disabled === true} onChange={onChange} />
        </div>
    );
};

function OptionRow({ data }: { data: Option }) {
    return (
        <div className={styles.option_row}>
            <div className={styles.option_avatar}>
                <RecipienteImagem src={data.caminhoAvatar} />
            </div>

            <div className={styles.option_textos}>
                <div className={styles.option_nome}>{data.nome}</div>
                <div className={styles.option_id}>#{data.id}</div>
            </div>
        </div>
    );
};

function ValueRow({ data }: { data: Option }) {
    return (
        <div className={styles.single_row}>
            <div className={styles.option_avatar}>
                <RecipienteImagem src={data.caminhoAvatar} />
            </div>

            <div className={styles.single_textos}>
                <div className={styles.single_nome}>{data.nome}</div>
                <div className={styles.single_id}>#{data.id}</div>
            </div>
        </div>
    );
};

function renderOption(props: OptionProps<Option, false, GroupBase<Option>>) {
    return (
        <components.Option {...props}>
            <OptionRow data={props.data} />
        </components.Option>
    );
};

function renderSingleValue(props: SingleValueProps<Option, false, GroupBase<Option>>) {
    return (
        <components.SingleValue {...props}>
            <ValueRow data={props.data} />
        </components.SingleValue>
    );
};

SelecionadorPersonagemBase.Option = (props) => renderOption(props);
SelecionadorPersonagemBase.SingleValue = (props) => renderSingleValue(props);