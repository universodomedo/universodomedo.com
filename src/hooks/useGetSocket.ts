"use client";

import type { Socket } from "socket.io-client";
import { getSocket, clearSocketCache as clearSocketCacheInternal, getActiveConnections as getActiveConnectionsInternal } from "Hooks/useEventoWs";

export const useGetSocket = (): Socket | null => { return getSocket(); };
export const clearSocketCache = () => { clearSocketCacheInternal(); };
export const getActiveConnections = () => { return getActiveConnectionsInternal(); };