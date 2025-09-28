import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'Redux/hooks/useRedux';
import { fetchCacheCompleto, selectCache, selectCacheCarregando, selectCacheErro, selectCacheTimestamp, selectCacheInicializado, marcarComoInicializado, invalidarCache } from 'Redux/slices/cacheSlice';

// Tempo de validade do cache (5 minutos)
const CACHE_VALIDITY_MS = 5 * 60 * 1000;

export const useCache = () => {
    const dispatch = useAppDispatch();
    const cache = useAppSelector(selectCache);
    const carregando = useAppSelector(selectCacheCarregando);
    const erro = useAppSelector(selectCacheErro);
    const timestamp = useAppSelector(selectCacheTimestamp);
    const inicializado = useAppSelector(selectCacheInicializado);

    useEffect(() => {
        const isCacheValido = timestamp && (Date.now() - timestamp) < CACHE_VALIDITY_MS;
        const deveCarregar = !inicializado && !carregando && !isCacheValido;

        if (deveCarregar) {
            dispatch(fetchCacheCompleto());
        } else if (!inicializado && !carregando) {
            // Se não precisa carregar mas ainda não está marcado como inicializado
            dispatch(marcarComoInicializado());
        }
    }, [dispatch, carregando, timestamp, inicializado]);

    // Verifica se os dados estão prontos para uso
    const pronto = inicializado && !carregando && timestamp !== null;

    return {
        ...cache,
        carregando,
        erro,
        timestamp,
        inicializado,
        pronto,
        refetch: () => dispatch(fetchCacheCompleto()),
        invalidar: () => dispatch(invalidarCache()),
    };
};