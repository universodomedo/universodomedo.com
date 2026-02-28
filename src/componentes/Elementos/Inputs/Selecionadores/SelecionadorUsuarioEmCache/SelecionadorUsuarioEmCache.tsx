'use client';

import styles from './styles.module.css';
import stylesBase from '../styles.module.css';

import { JSX, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { components, type GroupBase, type MultiValue, type MultiValueProps, type OnChangeValue, type OptionProps, type SingleValueProps } from 'react-select';

import { selectUsuarios } from 'Redux/selectors/usuariosSelectors';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';
import criarSelecionadorBase from '../SelecionadorBase';

type Option = { value: number; label: string; id: number; username: string };

const SelecionadorUsuarioEmCacheSingleBase = criarSelecionadorBase<Option, false>();
const SelecionadorUsuarioEmCacheMultiBase = criarSelecionadorBase<Option, true>();

type PropsSingle = { isMulti?: false; idSelecionado?: number | null; onSelectIdUsuario: (idUsuario: number | null) => void };
type PropsMulti = { isMulti: true; idsSelecionados?: number[]; onSelectIdsUsuarios: (idsUsuarios: number[]) => void };
type Props = PropsSingle | PropsMulti;

export default function SelecionadorUsuarioEmCache(props: PropsSingle): JSX.Element;
export default function SelecionadorUsuarioEmCache(props: PropsMulti): JSX.Element;
export default function SelecionadorUsuarioEmCache(props: Props) {
    const usuarios = useSelector(selectUsuarios);

    const options = useMemo<Option[]>(() => {
        const lista = (usuarios || []).map((u) => ({ value: u.id, id: u.id, username: u.username, label: `${u.username} ${u.id}` }));
        lista.sort((a, b) => a.id - b.id);
        return lista;
    }, [usuarios]);

    const valueSingle = useMemo<Option | null>(() => {
        if ('onSelectIdsUsuarios' in props) return null;
        const idSelecionado = props.idSelecionado ?? null;
        if (idSelecionado === null) return null;
        return options.find(option => option.id === idSelecionado) ?? null;
    }, [options, props]);

    const valueMulti = useMemo<MultiValue<Option>>(() => {
        if ('onSelectIdUsuario' in props) return [];
        const idsSelecionados = props.idsSelecionados ?? [];
        if (idsSelecionados.length <= 0) return [];
        return options.filter(option => idsSelecionados.includes(option.id));
    }, [options, props]);

    function onChangeSingle(option: OnChangeValue<Option, false>) { if ('onSelectIdUsuario' in props) props.onSelectIdUsuario(option ? option.id : null); }

    function onChangeMulti(option: OnChangeValue<Option, true>) { if ('onSelectIdsUsuarios' in props) props.onSelectIdsUsuarios((option as MultiValue<Option>).map((o) => o.id)); }

    const isMulti = props.isMulti === true;

    return (
        <div className={`${stylesBase.recipiente_interno_selecionador} ${styles.recipiente_interno_selecionador_usuario_emcache}`}>
            {isMulti ? (
                <SelecionadorUsuarioEmCacheMultiBase.Select className={stylesBase.select} classNamePrefix="rs" options={options} value={valueMulti} placeholder="Selecione usuários..." isClearable onChange={onChangeMulti} isMulti />
            ) : (
                <SelecionadorUsuarioEmCacheSingleBase.Select className={stylesBase.select} classNamePrefix="rs" options={options} value={valueSingle} placeholder="Selecione um usuário..." isClearable onChange={onChangeSingle} />
            )}
        </div>
    );
};

function OptionRow({ data }: { data: Option }) {
    return (
        <div className={styles.option_row}>
            <div className={styles.option_avatar}>
                <AvatarUsuarioEmVisualizacao_CACHED idUsuario={data.id} />
            </div>

            <div className={styles.option_textos}>
                <div className={styles.option_username}>{data.username}</div>
                <div className={styles.option_id}>#{data.id}</div>
            </div>
        </div>
    );
};

function ValueRow({ data }: { data: Option }) {
    return (
        <div className={styles.single_row}>
            <div className={styles.single_avatar}>
                <AvatarUsuarioEmVisualizacao_CACHED idUsuario={data.id} />
            </div>

            <div className={styles.single_textos}>
                <div className={styles.single_username}>{data.username}</div>
                <div className={styles.single_id}>#{data.id}</div>
            </div>
        </div>
    );
};

function renderOption<IsMulti extends boolean>(props: OptionProps<Option, IsMulti, GroupBase<Option>>) {
    return (
        <components.Option {...props}>
            <OptionRow data={props.data} />
        </components.Option>
    );
};

function renderSingleValue<IsMulti extends boolean>(props: SingleValueProps<Option, IsMulti, GroupBase<Option>>) {
    return (
        <components.SingleValue {...props}>
            <ValueRow data={props.data} />
        </components.SingleValue>
    );
};

function renderMultiValue<IsMulti extends boolean>(props: MultiValueProps<Option, IsMulti, GroupBase<Option>>) {
    return (
        <components.MultiValue {...props}>
            <ValueRow data={props.data} />
        </components.MultiValue>
    );
};

SelecionadorUsuarioEmCacheSingleBase.Option = (props) => renderOption<false>(props);
SelecionadorUsuarioEmCacheMultiBase.Option = (props) => renderOption<true>(props);

SelecionadorUsuarioEmCacheSingleBase.SingleValue = (props) => renderSingleValue<false>(props);
SelecionadorUsuarioEmCacheMultiBase.SingleValue = (props) => renderSingleValue<true>(props);

SelecionadorUsuarioEmCacheMultiBase.MultiValue = (props) => renderMultiValue<true>(props);