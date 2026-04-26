'use client';

import stylesBase from './styles.module.css';

import { JSX, ReactNode } from 'react';
import Select, { type GroupBase, type MultiValueProps, type OptionProps, type Props as ReactSelectProps, type SingleValueProps } from 'react-select';

type SelectProps<Option, IsMulti extends boolean, Group extends GroupBase<Option>> = ReactSelectProps<Option, IsMulti, Group>;

export type SelecionadorComposto<Option, IsMulti extends boolean, Group extends GroupBase<Option> = GroupBase<Option>> = {
    (props: { children?: ReactNode; className?: string }): JSX.Element;
    Select: (props: SelectProps<Option, IsMulti, Group>) => JSX.Element;
    Option: (props: OptionProps<Option, IsMulti, Group>) => JSX.Element;
    SingleValue: (props: SingleValueProps<Option, IsMulti, Group>) => JSX.Element;
    MultiValue: (props: MultiValueProps<Option, IsMulti, Group>) => JSX.Element;
};

function classeValida(classe: string | false | null | undefined): classe is string { return typeof classe === 'string' && classe.length > 0; }

function juntarClasses(...classes: Array<string | false | null | undefined>): string { return classes.filter(classeValida).join(' '); }

export default function criarSelecionadorBase<Option, IsMulti extends boolean, Group extends GroupBase<Option> = GroupBase<Option>>() {
    const Selecionador = (({ children, className }: { children?: ReactNode; className?: string }) => <div className={className}>{children}</div>) as SelecionadorComposto<Option, IsMulti, Group>;

    Selecionador.Option = (props: OptionProps<Option, IsMulti, Group>) => <div>{String(props.label)}</div>;
    Selecionador.SingleValue = (props: SingleValueProps<Option, IsMulti, Group>) => <div>{String((props as SingleValueProps<Option, false, Group>).data)}</div>;
    Selecionador.MultiValue = (props: MultiValueProps<Option, IsMulti, Group>) => <div>{String(props.data)}</div>;

    Selecionador.Select = (props: SelectProps<Option, IsMulti, Group>) => {
        const menuPortalTarget = typeof document === 'undefined' ? undefined : document.body;

        const styles = {
            ...(props.styles ?? {}),
            menuPortal: (base: Record<string, string | number>) => {
                const merged = (props.styles?.menuPortal ? props.styles.menuPortal(base as never, {} as never) : base) as Record<string, string | number>;
                return { ...merged, zIndex: 'var(--zindex-final-selectMenu)' };
            },
        };

        return (
            <Select<Option, IsMulti, Group>
                {...props}
                styles={styles as never}
                menuPortalTarget={menuPortalTarget}
                menuPosition="fixed"
                classNames={{
                    ...(props.classNames ?? {}),
                    menu: state => juntarClasses(stylesBase.menu, props.classNames?.menu?.(state)),
                    menuList: state => juntarClasses(stylesBase.menu_list, props.classNames?.menuList?.(state)),
                    option: state => juntarClasses(stylesBase.option, state.isFocused && stylesBase.option_focused, state.isSelected && stylesBase.option_selected, props.classNames?.option?.(state)),
                }}
                components={{ ...(props.components ?? {}), Option: Selecionador.Option, SingleValue: Selecionador.SingleValue, MultiValue: Selecionador.MultiValue }}
            />
        );
    };

    return Selecionador;
};