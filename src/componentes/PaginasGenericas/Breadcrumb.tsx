'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean);

    return (
        <div style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'blue' }}>
                Início
            </Link>
            {paths.map((path, index) => {
                const href = `/${paths.slice(0, index + 1).join('/')}`;
                const isLast = index === paths.length - 1;

                return (
                    <span key={path}>
                        <span style={{ margin: '0 5px' }}>/</span>
                        {isLast ? (
                            <span>{path}</span>
                        ) : (
                            <Link href={href} style={{ textDecoration: 'none', color: 'blue' }}>
                                {path}
                            </Link>
                        )}
                    </span>
                );
            })}
        </div>
    );
}