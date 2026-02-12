import { ReactNode, AnchorHTMLAttributes } from 'react';

import Link, { LinkProps } from 'next/link';
import cn from 'classnames';

export default function CustomLink({ children, inlineBlock = true, semDecoracao = false, style, className, ...props }: { children: ReactNode; inlineBlock?: boolean; semDecoracao?: boolean; } & LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>) {
    return (
        <Link {...props} style={inlineBlock ? { display: 'inline-block', ...style } : style} className={cn(className, { 'sem-decoracao': semDecoracao } )}>
            {children}
        </Link>
    );
};