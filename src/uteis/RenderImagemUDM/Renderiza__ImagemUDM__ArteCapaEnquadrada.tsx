import type { CSSProperties } from 'react';

import type { EncaixeArteCapaPartida } from 'types-nora-api';

interface Props {
    imagemBase64: string;
    encaixe?: EncaixeArteCapaPartida | null;
    className?: string;
    alt?: string;
};

// Render base-only da Arte de Capa (SEM título/assinatura) preenchendo o container, com encaixe opcional (zoom + pan nos DOIS eixos).
// Usa background-image (não <img>): pan horizontal só funciona com background-position quando o zoom cria folga (object-fit cover + scale central não pana em X); e <div> não dispara drag nativo de imagem.
// Papel duplo: item do Orbital (com encaixe) e fundo da página (sem encaixe = cover central). O container (caller) define proporção + overflow:hidden.
export function Renderiza__ImagemUDM__ArteCapaEnquadrada({ imagemBase64, encaixe, className, alt }: Props) {
    const escala = encaixe?.escala ?? 1;
    const posicaoX = 50 + (encaixe?.deslocamentoX ?? 0) * 50;
    const posicaoY = 50 + (encaixe?.deslocamentoY ?? 0) * 50;
    const estilo: CSSProperties = {
        width: '100%',
        height: '100%',
        backgroundImage: `url("data:image/png;base64,${imagemBase64}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${escala * 100}% auto`,
        backgroundPosition: `${posicaoX}% ${posicaoY}%`,
    };

    return <div className={className} style={estilo} role="img" aria-label={alt ?? ''} />;
};
