'use client';

import { ContextoAppRefreshProvider, useAppRefresh } from 'contextos/ContextoAppRefresh/contexto';
import { ContextoToastProvider } from 'contextos/ContextoToast/contexto';

function RefreshBoundary({ children }: { children: React.ReactNode }) {
    const { nonce } = useAppRefresh();
    return <div key={nonce} style={{ width: '100%', height: '100%' }}>{children}</div>;
};

export default function AppClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <ContextoAppRefreshProvider>
            <ContextoToastProvider>
                <RefreshBoundary>
                    {children}
                </RefreshBoundary>
            </ContextoToastProvider>
        </ContextoAppRefreshProvider>
    );
};