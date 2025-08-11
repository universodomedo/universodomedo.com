'use client';

import { ReactNode } from 'react';

import { useAppSelector } from 'redux/hooks/useRedux';
import { registrosMenu } from 'componentes/ElementosVisuais/LayoutContextualizado/MenusLayoutContextualizado/registrosMenu';

export default function LayoutContextualizado({ children }: { children: ReactNode }) {
    const activeKey = useAppSelector((s) => s.menu.activeKey);
    if (!activeKey) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 0.85, alignItems: 'center' }}>
                {children}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 0.15 }}>
                {registrosMenu[activeKey]}
            </div>
        </div>
    );
};