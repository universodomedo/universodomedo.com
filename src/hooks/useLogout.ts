'use client';

import { useCallback } from 'react';
import { desconectar } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

export default function useLogout() {
    const logout = useCallback(() => {
        try { void Promise.resolve(desconectar()); } catch (_e) { }
        if (window.location.pathname === '/') { window.location.reload(); return; }
        window.location.href = '/';
    }, []);

    return { logout };
};