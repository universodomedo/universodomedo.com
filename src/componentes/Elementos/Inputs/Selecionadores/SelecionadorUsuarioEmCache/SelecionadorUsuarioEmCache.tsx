'use client';

import styles from './styles.module.css';
import stylesBase from '../styles.module.css';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { components, type OptionProps, type SingleValueProps, type SingleValue } from 'react-select';

import { selectUsuarios } from 'Redux/selectors/usuariosSelectors';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';
import criarSelecionadorBase from '../SelecionadorBase';

type Option = { value: number; label: string; id: number; username: string };

const SelecionadorUsuarioEmCacheBase = criarSelecionadorBase<Option>();

export default function SelecionadorUsuarioEmCache({ onSelectIdUsuario }: { onSelectIdUsuario: (idUsuario: number | null) => void }) {
    const usuarios = useSelector(selectUsuarios);

    const options = useMemo<Option[]>(() => {
        const lista = (usuarios || []).map((u) => ({ value: u.id, id: u.id, username: u.username, label: `${u.username} ${u.id}` }));
        lista.sort((a, b) => a.id - b.id);
        return lista;
    }, [usuarios]);

    function onChange(option: SingleValue<Option>) { onSelectIdUsuario(option ? option.id : null); }

    return (
        <div className={`${stylesBase.recipiente_interno_selecionador} ${styles.recipiente_interno_selecionador_usuario_emcache}`}>
            <SelecionadorUsuarioEmCacheBase.Select
                className={stylesBase.select}
                classNamePrefix="rs"
                options={options}
                placeholder="Selecione um usuário..."
                isClearable
                onChange={onChange}
            />
        </div>
    );
};

SelecionadorUsuarioEmCacheBase.Option = (props: OptionProps<Option, false>) => {
    const data = props.data;

    return (
        <components.Option {...props}>
            <div className={styles.option_row}>
                <div className={styles.option_avatar}>
                    <AvatarUsuarioEmVisualizacao_CACHED idUsuario={data.id} />
                </div>

                <div className={styles.option_textos}>
                    <div className={styles.option_username}>{data.username}</div>
                    <div className={styles.option_id}>#{data.id}</div>
                </div>
            </div>
        </components.Option>
    );
};

SelecionadorUsuarioEmCacheBase.SingleValue = (props: SingleValueProps<Option, false>) => {
    const data = props.data;

    return (
        <components.SingleValue {...props}>
            <div className={styles.single_row}>
                <div className={styles.single_avatar}>
                    <AvatarUsuarioEmVisualizacao_CACHED idUsuario={data.id} />
                </div>

                <div className={styles.single_textos}>
                    <div className={styles.single_username}>{data.username}</div>
                    <div className={styles.single_id}>#{data.id}</div>
                </div>
            </div>
        </components.SingleValue>
    );
};