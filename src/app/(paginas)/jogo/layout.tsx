'use client';

import { ReactNode } from "react";

import JogoRouteGuard from "./JogoRouteGuard";

export default function LayoutJogo({ children }: { children: ReactNode }) {
    return (
        <JogoRouteGuard>
            {children}
        </JogoRouteGuard>
    );
};