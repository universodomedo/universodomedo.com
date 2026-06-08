'use client';

import styles from './styles.module.css';

import { useEffect, useState } from 'react';

import { AreaInterativa3D } from '../AreaInterativa3D';
import { Editor3DProvider, useEditor3DContexto } from '../contexto/Editor3DContexto';
import { carregaPayloadScreenshotTemporarioEditor3D, desserializaCameraScreenshotTemporarioEditor3D, type PayloadScreenshotTemporarioEditor3D } from './editor3D.screenshotTemporario';

type StatusPaginaScreenshotTemporarioEditor3D = 'CARREGANDO' | 'SEM_PAYLOAD' | 'RENDERIZANDO';

function ConteudoPaginaScreenshotTemporarioEditor3D() {
    const { acoes } = useEditor3DContexto();
    const [status, setStatus] = useState<StatusPaginaScreenshotTemporarioEditor3D>('CARREGANDO');
    const [payload, setPayload] = useState<PayloadScreenshotTemporarioEditor3D | null>(null);

    useEffect(() => {
        const payloadCarregado = carregaPayloadScreenshotTemporarioEditor3D();

        if (payloadCarregado === null) {
            setStatus('SEM_PAYLOAD');

            return;
        }

        acoes.carregaCenaCanonica(payloadCarregado.cenaCanonica);
        acoes.atualizaCamera(desserializaCameraScreenshotTemporarioEditor3D(payloadCarregado.camera));
        setPayload(payloadCarregado);
        setStatus('RENDERIZANDO');
    }, [acoes]);

    if (status === 'SEM_PAYLOAD') {
        return (
            <main className={styles.paginaScreenshotTemporarioEditor3D}>
                <section className={styles.avisoScreenshotTemporarioEditor3D} role="status">
                    <h1>Nao ha cena temporaria para renderizar.</h1>
                </section>
            </main>
        );
    }

    if (status === 'CARREGANDO' || payload === null) {
        return (
            <main className={styles.paginaScreenshotTemporarioEditor3D}>
                <section className={styles.avisoScreenshotTemporarioEditor3D} role="status">
                    <h1>Carregando cena temporaria.</h1>
                </section>
            </main>
        );
    }

    return (
        <main className={styles.paginaScreenshotTemporarioEditor3D} aria-label={payload.nomeTemporario}>
            <AreaInterativa3D modoRenderizacao="EXPORTACAO" />
        </main>
    );
};

export function PaginaScreenshotTemporarioEditor3D() {
    return (
        <Editor3DProvider>
            <ConteudoPaginaScreenshotTemporarioEditor3D />
        </Editor3DProvider>
    );
};
