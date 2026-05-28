'use client';

import styles from './styles.module.css';

import { useEffect, type MouseEvent, type ReactNode } from 'react';

interface ModalAreaInterativa3DProps {
    readonly titulo: string;
    readonly subtitulo: string;
    readonly ariaLabel: string;
    readonly acoes?: ReactNode;
    readonly children: ReactNode;
    readonly fecha: () => void;
};

export function ModalAreaInterativa3D({ titulo, subtitulo, ariaLabel, acoes, children, fecha }: ModalAreaInterativa3DProps) {
    useEffect(() => {
        function processaTeclaModal(event: KeyboardEvent): void {
            event.stopImmediatePropagation();
            if (event.key !== 'Escape') return;

            event.preventDefault();
            fecha();
        };

        window.addEventListener('keydown', processaTeclaModal, true);

        return () => window.removeEventListener('keydown', processaTeclaModal, true);
    }, [fecha]);

    function fechaAoClicarFora(event: MouseEvent<HTMLDivElement>): void {
        event.preventDefault();
        event.stopPropagation();
        fecha();
    };

    function bloqueiaCliqueConteudo(event: MouseEvent<HTMLElement>): void { event.stopPropagation(); };

    return (
        <div className={styles.fundoModalAreaInterativa3D} role="presentation" onMouseDown={fechaAoClicarFora}>
            <section className={styles.janelaModalAreaInterativa3D} role="dialog" aria-modal="true" aria-label={ariaLabel} onMouseDown={bloqueiaCliqueConteudo}>
                <header className={styles.cabecalhoModalAreaInterativa3D}>
                    <div>
                        <span>{titulo}</span>
                        <strong>{subtitulo}</strong>
                    </div>

                    <div className={styles.acoesModalAreaInterativa3D}>
                        {acoes}
                        <button type="button" onClick={fecha} aria-label="Fechar modal">Fechar</button>
                    </div>
                </header>

                <div className={styles.conteudoModalAreaInterativa3D}>{children}</div>
            </section>
        </div>
    );
};
