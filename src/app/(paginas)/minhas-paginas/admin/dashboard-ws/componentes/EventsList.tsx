'use client';
import React from 'react';
import { TelemetryEventLog } from 'types-nora-api';
import ClientTime from './ClientTime';

export default function EventsList({ events }: { events: TelemetryEventLog[] }) {
    if (!events || events.length === 0) {
        return <div className="empty-state">Sem eventos recentes</div>;
    }

    const display = events.slice(-200).reverse(); // newest first

    return (
        <div className="events-list">
            {display.map((e, idx) => (
                <div key={idx} className={`event-item event-${e.direction}`}>
                    <div className="event-row">
                        <div className="event-meta">
                            <strong>{e.event}</strong>
                            <span className="event-username">{e.username ?? 'anonimo'}</span>
                            <ClientTime timestamp={e.timestamp} />
                        </div>
                        <div className="event-payload">
                            {e.payload ? <pre>{JSON.stringify(e.payload)}</pre> : <em>no payload</em>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};