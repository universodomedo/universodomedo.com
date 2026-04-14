'use client';

import { ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'Redux/hooks/useRedux';
import { fetchCacheCompleto, selectCacheCarregando, selectCacheErro, selectCacheInicializado } from 'Redux/slices/cacheSlice';

export default function InicializadorCache({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const carregando = useAppSelector(selectCacheCarregando);
    const erro = useAppSelector(selectCacheErro);
    const inicializado = useAppSelector(selectCacheInicializado);

    useEffect(() => {
        if (!inicializado && !carregando) {
            dispatch(fetchCacheCompleto());
        }
        
    }, [dispatch, inicializado, carregando]);

    if (carregando) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#1a1a1a',
                color: 'white',
                fontSize: '1.2rem'
            }}>
                Carregando dados iniciais...
            </div>
        );
    }

    // Mostra erro se ocorrer
    if (erro) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#1a1a1a',
                color: 'white',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <h1 style={{ color: '#ff4444', marginBottom: '1rem' }}>Erro ao carregar aplicação</h1>
                <p style={{ marginBottom: '2rem' }}>{erro}</p>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '0.5rem 1rem',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    return <>{children}</>;
};