'use client';

import styles from './styles.module.css';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Select, { components, SingleValue } from 'react-select';

import { selectUsuarios } from 'Redux/selectors/usuariosSelectors';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/page';

type Option = { value: number; label: string; id: number; username: string };

function OptionUsuario(props: any) {
    const data = props.data as Option;

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

function SingleValueUsuario(props: any) {
    const data = props.data as Option;

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

export default function SelecionadorUsuarioEmCache({ onSelectIdUsuario }: { onSelectIdUsuario: (idUsuario: number | null) => void }) {
    const usuarios = useSelector(selectUsuarios);

    const options = useMemo<Option[]>(() => {
        const lista = (usuarios || []).map((u) => ({ value: u.id, id: u.id, username: u.username, label: `${u.username} ${u.id}` }));
        lista.sort((a, b) => a.id - b.id);
        return lista;
    }, [usuarios]);

    function onChange(option: SingleValue<Option>) { onSelectIdUsuario(option ? option.id : null); }

    return (
        <div className={styles.recipiente_interno_selecionador_usuario_emcache}>
            <Select
                className={styles.select}
                classNamePrefix="rsu"
                options={options}
                placeholder="Selecione um usuário..."
                isClearable
                onChange={onChange}
                components={{ Option: OptionUsuario, SingleValue: SingleValueUsuario }}
            />
        </div>
    );
};