'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import type { ConteudoArteCapaUDM } from 'types-nora-api';

import { FONTES_ASSINATURA, HREF_GOOGLE_FONTS_ASSINATURA } from 'Funcionalidades/AssinaturaArtista/assinaturaArtista.api';

interface Props {
    conteudo: ConteudoArteCapaUDM;
    mostrarControles?: boolean;
    className?: string;
};

// Componente reutilizável de render da Arte de Capa: recebe UM objeto branded (imagem base + camada do título + assinatura, já montados) e é o dono dos toggles de Título e Assinatura.
export function Renderiza__ImagemUDM__ArteCapa({ conteudo, mostrarControles = true, className }: Props) {
    const [exibeTitulo, setExibeTitulo] = useState(true);
    const [exibeAssinatura, setExibeAssinatura] = useState(true);

    const temTitulo = conteudo.camadaTitulo !== null;
    const assinatura = conteudo.assinatura;

    return (
        <div className={`${styles.envolucro} ${className ?? ''}`}>
            {/* Fontes script (Google Fonts) usadas pela assinatura. */}
            <link rel="stylesheet" href={HREF_GOOGLE_FONTS_ASSINATURA} />

            {mostrarControles && (temTitulo || assinatura !== null) && (
                <div className={styles.controles}>
                    {temTitulo && (
                        <button type="button" className={`${styles.toggle} ${exibeTitulo ? styles.toggleAtivo : ''}`} onClick={() => setExibeTitulo(estado => !estado)}>Título</button>
                    )}
                    {assinatura !== null && (
                        <button type="button" className={`${styles.toggle} ${exibeAssinatura ? styles.toggleAtivo : ''}`} onClick={() => setExibeAssinatura(estado => !estado)}>Assinatura</button>
                    )}
                </div>
            )}

            <div className={styles.moldura}>
                <img className={styles.base} src={`data:image/png;base64,${conteudo.imagem}`} alt="Arte de Capa" />
                {conteudo.camadaTitulo !== null && exibeTitulo && (
                    <img className={styles.camadaTitulo} src={`data:image/png;base64,${conteudo.camadaTitulo}`} alt="Camada do título da capa" />
                )}
                {assinatura !== null && exibeAssinatura && (
                    <span className={styles.assinatura} style={{ fontFamily: FONTES_ASSINATURA[assinatura.fonte].familia }}>{assinatura.texto}</span>
                )}
            </div>
        </div>
    );
};
