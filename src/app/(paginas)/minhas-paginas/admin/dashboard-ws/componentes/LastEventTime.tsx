'use client';
import { useEffect, useState } from 'react';
import { TelemetryEventLog } from 'types-nora-api';

export default function LastEventTime({ events }: { events: TelemetryEventLog[] }) {
    const [text, setText] = useState('Nenhum');

    useEffect(() => {
        if (events && events.length > 0) {
            const last = events[events.length - 1];
            const sec = Math.round((Date.now() - last.timestamp) / 1000);
            setText(`${sec}s atrás`);
        } else {
            setText('Nenhum');
        }
    }, [events]);

    return <span className="last-event">{text}</span>;
};