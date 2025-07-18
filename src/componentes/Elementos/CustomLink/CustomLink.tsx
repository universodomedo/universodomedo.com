import cn from 'classnames';
import Link, { LinkProps } from 'next/link';
import { ReactNode, AnchorHTMLAttributes } from 'react';

export default function CustomLink({ children, inlineBlock = true, semDecoracao = false, style, className, ...props }: { children: ReactNode; inlineBlock?: boolean; semDecoracao?: boolean; } & LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>) {
    return (
        <Link {...props} style={inlineBlock ? { display: 'inline-block', ...style } : style} className={cn(className, { 'sem-decoracao': semDecoracao } )}>
            {children}
        </Link>
    );
}