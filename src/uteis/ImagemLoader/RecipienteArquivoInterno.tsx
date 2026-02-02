'use client';

import { CSSProperties } from 'react';
import { ArquivoInternoKey, ARQUIVOS_INTERNOS } from 'types-nora-api';

import { carregaImagem } from 'Uteis/ImagemLoader/ImagemLoader.ts';

export default function RecipienteArquivoInterno({ arquivo, className, alt, style }: { arquivo: ArquivoInternoKey; className?: string; alt?: string; style?: CSSProperties; }) {
    return <img src={carregaImagem({ src: ARQUIVOS_INTERNOS[arquivo].caminhoArquivo })} className={className} alt={alt ?? ''} style={style} />;
};