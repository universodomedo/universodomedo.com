'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean);

    return (
        <div style={{ padding: '10px', width: '100%' }}>
            {paths.map((path, index) => {
                const href = `/${paths.slice(0, index + 1).join('/')}`;
                const isLast = index === paths.length - 1;

                return (
                    <span key={path}>
                        {isLast ? (
                            <span>{path}</span>
                        ) : (
                            <><Link href={href}>{path}</Link><span style={{ margin: '0 5px' }}>→</span></>
                        )}
                    </span>
                );
            })}
        </div>
    );
}