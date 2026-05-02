'use client';

import { useSyncExternalStore } from 'react';

import { inscreveListenerRequisicoesNoraApi, obtemSnapshotRequisicoesNoraApi, obtemSnapshotServidorRequisicoesNoraApi, NoraApiRequisicoesEstado } from 'Api/NoraApiRequisicoesStore';

export default function useEstadoRequisicoesNoraApi(): NoraApiRequisicoesEstado {
    return useSyncExternalStore(inscreveListenerRequisicoesNoraApi, obtemSnapshotRequisicoesNoraApi, obtemSnapshotServidorRequisicoesNoraApi);
};