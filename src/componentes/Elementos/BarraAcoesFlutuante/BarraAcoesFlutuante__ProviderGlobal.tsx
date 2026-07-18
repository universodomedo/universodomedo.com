'use client';

import type { ReactNode } from 'react';

import { ContextoBarraAcoesFlutuante__Provider } from 'Contextos/ContextoBarraAcoesFlutuante/contexto';
import { ContextoUsuariosOnline__Provider } from 'Contextos/ContextoUsuariosOnline/contexto';
import { ContextoCentralAudio__Provider } from 'Contextos/ContextoCentralAudio/contexto';
import { ContextoControlePalco__Provider } from 'Contextos/ContextoControlePalco/contexto';
import { ContextoResumoPainelDoMedo__Provider } from 'Contextos/ContextoResumoPainelDoMedo/contexto';

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
                <ContextoCentralAudio__Provider>
                    <ContextoControlePalco__Provider>
                        <ContextoResumoPainelDoMedo__Provider>
                            {children}
                        </ContextoResumoPainelDoMedo__Provider>
                    </ContextoControlePalco__Provider>
                </ContextoCentralAudio__Provider>
            </ContextoUsuariosOnline__Provider>
        </ContextoBarraAcoesFlutuante__Provider>
    );
};