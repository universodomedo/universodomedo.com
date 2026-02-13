'use client';

import type { ComponentProps, ReactNode } from 'react';
import cn from 'classnames';

import type { DestinoInput } from 'Funcionalidades/navegacaoInterna';
import LinkInterno from 'Componentes/Elementos/LinkInterno/LinkInterno';

type Props = Omit<ComponentProps<typeof LinkInterno>, 'destino' | 'children'> & { destino: DestinoInput; children: ReactNode; inlineBlock?: boolean; semDecoracao?: boolean };

export default function CustomLink({ destino, children, inlineBlock = true, semDecoracao = false, style, className, ...rest }: Props) {
    return (
        <LinkInterno destino={destino} {...rest} style={inlineBlock ? { display: 'inline-block', ...style } : style} className={cn(className, { 'sem-decoracao': semDecoracao })}>
            {children}
        </LinkInterno>
    );
};