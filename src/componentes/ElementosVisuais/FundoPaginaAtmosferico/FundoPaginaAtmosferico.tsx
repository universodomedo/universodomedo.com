'use client';

import styles from './styles.module.css';

import type { ReactNode } from 'react';

import { usePathname } from 'next/navigation';

interface FundoPaginaAtmosfericoProps {
    children: ReactNode;
    className?: string;
};

export default function FundoPaginaAtmosferico({ children, className = '' }: FundoPaginaAtmosfericoProps) {
    const pathname = usePathname();

    if (pathname === '/') return children;

    return (
        <section className={`${styles.fundoPaginaAtmosferico} ${className}`}>
            <div className={styles.camadaBase} />
            <div className={styles.camadaHaloPrincipal} />
            <div className={styles.camadaHaloSecundario} />
            <div className={styles.camadaNeblina} />
            <div className={styles.camadaTextura} />
            <div className={styles.camadaVinheta} />
            <div className={styles.camadaConteudo}>
                {children}
            </div>
        </section>
    );
};