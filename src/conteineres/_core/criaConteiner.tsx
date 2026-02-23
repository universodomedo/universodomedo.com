'use client';

import { ComponentType } from 'react';

type DefinicaoConteiner<TProps> = { useEstado: () => TProps; resolveComponente: (props: TProps) => ComponentType; };

export function criaConteiner<TProps>({ useEstado, resolveComponente }: DefinicaoConteiner<TProps>) {
    return function Conteiner() {
        const props = useEstado();
        const Pagina = resolveComponente(props);

        return <Pagina />;
    };
};