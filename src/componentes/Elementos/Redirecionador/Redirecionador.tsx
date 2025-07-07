'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Redirecionador({ urlRedirecionar }: { urlRedirecionar: string }) {
    const router = useRouter();

    useEffect(() => {
        router.push(urlRedirecionar);
    }, [router]);

    return null;
}