import Link, { LinkProps } from 'next/link';
import { ReactNode, AnchorHTMLAttributes } from 'react';

export default function CustomLink({ children, inlineBlock = true, style, ...props }: { children: ReactNode; inlineBlock?: boolean; } & LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>) {
    return (
        <Link {...props} style={inlineBlock ? { display: 'inline-block', ...style } : style}>
            {children}
        </Link>
    );
}