'use client';

import { JSX, ReactNode } from 'react';
import Select, { type GroupBase, type OptionProps, type Props as ReactSelectProps, type SingleValueProps } from 'react-select';

type SelectProps<Option, Group extends GroupBase<Option>> = ReactSelectProps<Option, false, Group>;

export type SelecionadorComposto<Option, Group extends GroupBase<Option> = GroupBase<Option>> = {
    (props: { children?: ReactNode; className?: string }): JSX.Element;
    Select: (props: SelectProps<Option, Group>) => JSX.Element;
    Option: (props: OptionProps<Option, false, Group>) => JSX.Element;
    SingleValue: (props: SingleValueProps<Option, false, Group>) => JSX.Element;
};

export default function criarSelecionadorBase<Option, Group extends GroupBase<Option> = GroupBase<Option>>() {
    const Selecionador = (({ children, className }: { children?: ReactNode; className?: string }) => <div className={className}>{children}</div>) as SelecionadorComposto<Option, Group>;

    Selecionador.Option = (props: OptionProps<Option, false, Group>) => <div>{String(props.label)}</div>;

    Selecionador.SingleValue = (props: SingleValueProps<Option, false, Group>) => <div>{String(props.data)}</div>;

    Selecionador.Select = (props: SelectProps<Option, Group>) => {
        const menuPortalTarget = typeof document === 'undefined' ? undefined : document.body;
        return <Select<Option, false, Group> {...props} menuPortalTarget={menuPortalTarget} menuPosition="fixed" components={{ ...(props.components ?? {}), Option: Selecionador.Option, SingleValue: Selecionador.SingleValue }} />;
    };

    return Selecionador;
};