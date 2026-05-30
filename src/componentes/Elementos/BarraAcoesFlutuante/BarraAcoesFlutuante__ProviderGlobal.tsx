'use client';

import type { ReactNode } from 'react';

import { ContextoBarraAcoesFlutuante__Provider } from 'Contextos/ContextoBarraAcoesFlutuante/contexto';
import { ContextoUsuariosOnline__Provider } from 'Contextos/ContextoUsuariosOnline/contexto';

// Wrapper Client Component que conecta o ContextoBarraAcoesFlutuante__Provider
// às ações globais da aplicação.
//
// Manter este arquivo como Client Component garante que as ações (que contêm
// funções como onClick) não sejam serializadas ao cruzar a fronteira
// Server → Client do Next.js.
//
// Para registrar novas ações globais, editar: acoes-globais.tsx

export function BarraAcoesFlutuante__ProviderGlobal({ children }: { children: ReactNode }) {
    return (
        <ContextoBarraAcoesFlutuante__Provider>
            <ContextoUsuariosOnline__Provider>
                {children}
            </ContextoUsuariosOnline__Provider>
        </ContextoBarraAcoesFlutuante__Provider>
    );
};