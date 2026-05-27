'use client';

import styles from './styles.module.css';

import { useEffect, useState } from 'react';
import { CaminhoArquivoArte } from 'types-nora-api';

import { carregaDocumentoCena3DPrototipoSalaDeJogo } from 'Funcionalidades/Cena3DPrototipo/cena3DPrototipo.storage';
import { RuntimeCena3DPrototipoSalaDeJogo } from './RuntimeCena3DPrototipoSalaDeJogo';
import { RenderArquivoArteCapa } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';
import type { DocumentoCena3DPrototipo } from 'Funcionalidades/Cena3DPrototipo/cena3DPrototipo.types';

export default function TelaDeJogo({ capaSessao }: { capaSessao: CaminhoArquivoArte }) {
    const [documentoCena3D, setDocumentoCena3D] = useState<DocumentoCena3DPrototipo | null>(null);

    useEffect(() => {
        setDocumentoCena3D(carregaDocumentoCena3DPrototipoSalaDeJogo());
    }, []);

    return (
        <div className={styles.recipiente_tela_jogo}>
            {documentoCena3D === null ? <RenderArquivoArteCapa caminhoArquivoArte={capaSessao} /> : <RuntimeCena3DPrototipoSalaDeJogo documento={documentoCena3D} />}
        </div>
    );
};
