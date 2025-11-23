'use client';
import { useEffect, useState } from 'react';

export default function ClientTime({ timestamp }: { timestamp: number | string }) {
    const [time, setTime] = useState('');

    useEffect(() => {
        const d = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
        setTime(d.toLocaleTimeString('pt-BR'));
    }, [timestamp]);

    return <span className="event-time">{time || '...'}</span>;
};