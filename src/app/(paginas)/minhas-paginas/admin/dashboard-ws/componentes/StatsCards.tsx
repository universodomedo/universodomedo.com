'use client';
import React from 'react';
import { TelemetrySnapshot } from 'types-nora-api';

export default function StatsCards({ snapshot }: { snapshot: TelemetrySnapshot | null }) {
    const active = snapshot?.totalConnections ?? 0;
    const totalEvents = snapshot?.totalEvents ?? 0;
    const auth = snapshot?.connections?.filter(c => c.userId != null).length ?? 0;
    const unauth = active - auth;
    return (
        <div className="stats-cards">
            <div className="stat-card">
                <div className="stat-value">{active}</div>
                <div className="stat-label">Conexões Ativas</div>
            </div>
            <div className="stat-card">
                <div className="stat-value">{auth}</div>
                <div className="stat-label">Autenticados</div>
            </div>
            <div className="stat-card">
                <div className="stat-value">{unauth}</div>
                <div className="stat-label">Não autenticados</div>
            </div>
            <div className="stat-card">
                <div className="stat-value">{totalEvents}</div>
                <div className="stat-label">Total Eventos</div>
            </div>
        </div>
    );
};