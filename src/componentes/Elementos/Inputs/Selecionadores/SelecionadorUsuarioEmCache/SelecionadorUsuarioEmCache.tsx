'use client';

import styles from './styles.module.css';
import stylesBase from '../styles.module.css';

import { JSX, useMemo, useState, type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { components, type GroupBase, type MultiValue, type MultiValueProps, type OnChangeValue, type OptionProps, type SingleValueProps } from 'react-select';

import { selectUsuarios } from 'Redux/selectors/usuariosSelectors';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';
import criarSelecionadorBase from '../SelecionadorBase';

type Option = { value: number; label: string; id: number; username: string };

const SelecionadorUsuarioEmCacheSingleBase = criarSelecionadorBase<Option, false>();
const SelecionadorUsuarioEmCacheMultiBase = criarSelecionadorBase<Option, true>();

type PropsBase = { idsExcluidos?: readonly number[] };
type PropsSingle = PropsBase & { isMulti?: false; idSelecionado?: number | null; onSelectIdUsuario: (idUsuario: number | null) => void };
type PropsMulti = PropsBase & { isMulti: true; idsSelecionados?: number[]; onSelectIdsUsuarios: (idsUsuarios: number[]) => void };
type Props = PropsSingle | PropsMulti;

export default function SelecionadorUsuarioEmCache(props: PropsSingle): JSX.Element;
export default function SelecionadorUsuarioEmCache(props: PropsMulti): JSX.Element;
export default function SelecionadorUsuarioEmCache(props: Props) {
    const usuarios = useSelector(selectUsuarios);

    const options = useMemo<Option[]>(() => {
        // idsExcluidos remove usuarios que nao devem ser oferecidos (ex.: quem ja tem a permissao / o proprio criador).
        const excluidos = new Set(props.idsExcluidos ?? []);
        const lista = (usuarios || []).filter(u => !excluidos.has(u.id)).map((u) => ({ value: u.id, id: u.id, username: u.username, label: `${u.username} ${u.id}` }));
        lista.sort((a, b) => a.id - b.id);
        return lista;
    }, [usuarios, props.idsExcluidos]);

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

// Variante em GATILHO da MESMA centralização de "selecionar usuário": o dropdown abre ancorado no elemento passado (ex.: o chip "+"), sem input intermediário. Mesma fonte (cache Redux) e mesmo visual de linha (OptionRow).
export function SelecionadorUsuarioEmCacheDropdown({ gatilho, idsExcluidos, onSelectIdUsuario }: { gatilho: ReactNode; idsExcluidos?: readonly number[]; onSelectIdUsuario: (idUsuario: number) => void }) {
    const usuarios = useSelector(selectUsuarios);
    const [aberto, setAberto] = useState(false);
    const [filtro, setFiltro] = useState('');

    const opcoes = useMemo<Option[]>(() => {
        const termo = filtro.trim().toLowerCase();
        return (usuarios || [])
            .filter(u => !(idsExcluidos ?? []).includes(u.id))
            .filter(u => !termo || u.username.toLowerCase().includes(termo) || String(u.id).startsWith(termo))
            .sort((a, b) => a.id - b.id)
            .map(u => ({ value: u.id, id: u.id, username: u.username, label: `${u.username} ${u.id}` }));
    }, [usuarios, idsExcluidos, filtro]);

    const fechar = () => { setAberto(false); setFiltro(''); };
    const seleciona = (idUsuario: number) => { onSelectIdUsuario(idUsuario); fechar(); };

    return (
        <span className={styles.dropdown_recipiente}>
            <span className={styles.dropdown_gatilho} onClick={() => setAberto(atual => !atual)}>{gatilho}</span>
            {aberto && (
                <>
                    <div className={styles.dropdown_overlay} onClick={fechar} />
                    <div className={styles.dropdown_menu}>
                        <input className={styles.dropdown_filtro} autoFocus value={filtro} onChange={evento => setFiltro(evento.target.value)} onKeyDown={evento => { if (evento.key === 'Escape') fechar(); }} placeholder="Filtrar por nome ou id…" />
                        <div className={styles.dropdown_lista}>
                            {opcoes.length === 0 && <span className={styles.dropdown_vazio}>Nenhum usuário disponível.</span>}
                            {opcoes.map(opcao => (
                                <button key={opcao.id} className={styles.dropdown_item} onClick={() => seleciona(opcao.id)}>
                                    <OptionRow data={opcao} />
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </span>
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