'use client';

import stylesBase from '../styles.module.css';

import { JSX, useMemo } from 'react';
import CreatableSelect from 'react-select/creatable';

type OpcaoFonte = { value: string; label: string; idFonte: number | null };

type SelecionadorFonteMusicaProps = {
    options: { id: number; nome: string }[];
    idSelecionado: number | null;
    nomeNovo: string | null;
    onSelecionar: (selecao: { idFonteMusica: number | null; nomeFonteNova: string | null }) => void;
    disabled?: boolean;
};

export default function SelecionadorFonteMusica(props: SelecionadorFonteMusicaProps): JSX.Element {
    const opcoes = useMemo<OpcaoFonte[]>(() => props.options.map(fonte => ({ value: `fonte-${fonte.id}`, label: fonte.nome, idFonte: fonte.id })), [props.options]);

    const value = useMemo<OpcaoFonte | null>(() => {
        if (props.idSelecionado !== null) return opcoes.find(opcao => opcao.idFonte === props.idSelecionado) ?? null;
        if (props.nomeNovo !== null && props.nomeNovo.length > 0) return { value: `novo-${props.nomeNovo}`, label: props.nomeNovo, idFonte: null };
        return null;
    }, [opcoes, props.idSelecionado, props.nomeNovo]);

    const menuPortalTarget = typeof document === 'undefined' ? undefined : document.body;
    const estilos = { menuPortal: (base: Record<string, string | number>) => ({ ...base, zIndex: 'var(--zindex-final-selectMenu)' }) };

    function aoMudar(opcao: OpcaoFonte | null) {
        if (!opcao) return props.onSelecionar({ idFonteMusica: null, nomeFonteNova: null });
        if (opcao.idFonte !== null) return props.onSelecionar({ idFonteMusica: opcao.idFonte, nomeFonteNova: null });
        return props.onSelecionar({ idFonteMusica: null, nomeFonteNova: opcao.label });
    };

    function aoCriar(texto: string) { props.onSelecionar({ idFonteMusica: null, nomeFonteNova: texto.trim() }); };

    return (
        <div className={stylesBase.recipiente_interno_selecionador}>
            <CreatableSelect<OpcaoFonte, false>
                className={stylesBase.select}
                classNamePrefix="rs"
                options={opcoes}
                value={value}
                isClearable
                isDisabled={props.disabled === true}
                placeholder={'Selecione ou crie uma fonte...'}
                formatCreateLabel={texto => `Criar fonte "${texto}"`}
                menuPortalTarget={menuPortalTarget}
                menuPosition="fixed"
                styles={estilos as never}
                classNames={{ menu: () => stylesBase.menu, menuList: () => stylesBase.menu_list, option: state => [stylesBase.option, state.isFocused && stylesBase.option_focused, state.isSelected && stylesBase.option_selected].filter(Boolean).join(' ') }}
                onChange={aoMudar}
                onCreateOption={aoCriar}
            />
        </div>
    );
};
