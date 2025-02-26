import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type EntityCache = {
    data: any[];
    loading: boolean;
    error: string | null;
};

type MultiEntityCacheContextType = {
    cache: Record<string, EntityCache>;
    reload: (entityKey: string, loader: () => Promise<any[]>) => Promise<void>;
};

const MultiEntityCacheContext = createContext<MultiEntityCacheContextType | undefined>(undefined);

type MultiEntityCacheProviderProps = {
    children: ReactNode;
};

export function MultiEntityCacheProvider({ children }: MultiEntityCacheProviderProps) {
    const [cache, setCache] = useState<Record<string, EntityCache>>({});

    const reload = async (entityKey: string, loader: () => Promise<any[]>) => {
        setCache(prev => ({
            ...prev,
            [entityKey]: { ...prev[entityKey], loading: true, error: null },
        }));

        try {
            const data = await loader();
            setCache(prev => ({
                ...prev,
                [entityKey]: { data, loading: false, error: null },
            }));
        } catch (error) {
            setCache(prev => ({
                ...prev,
                [entityKey]: { data: [], loading: false, error: 'Erro ao carregar os dados.' },
            }));
        }
    };

    return (
        <MultiEntityCacheContext.Provider value={{ cache, reload }}>
            {children}
        </MultiEntityCacheContext.Provider>
    );
}

export function useEntityCache(entityKey: string, loader: () => Promise<any[]>) {
    const context = useContext(MultiEntityCacheContext);
    if (!context) {
        throw new Error('useEntityCache deve ser usado dentro de um MultiEntityCacheProvider');
    }

    const { cache, reload } = context;

    useEffect(() => {
        if (!cache[entityKey] || cache[entityKey].error) {
            reload(entityKey, loader);
        }
    }, [entityKey, loader]);

    return {
        data: cache[entityKey]?.data || [],
        loading: cache[entityKey]?.loading || true,
        error: cache[entityKey]?.error || null,
        reload: () => reload(entityKey, loader),
    };
}