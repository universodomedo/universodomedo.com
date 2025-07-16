import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';

interface CustomLinkProps extends LinkProps {
    children: ReactNode;
}

export default function CustomLink({ children, ...props }: CustomLinkProps) {
    return (
        <Link {...props} style={{ display: 'inline-block' }}>
            {children}
        </Link>
    );
}