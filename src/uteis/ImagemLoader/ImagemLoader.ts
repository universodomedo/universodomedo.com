import { ArquivoInternoKey, ARQUIVOS_INTERNOS } from "types-nora-api";

export function carregaImagem({ src, onError }: { src: string | undefined; onError?: (error: Error) => void; }): string {
    return getImageUrl(src);
};

export function carregaArquivoInterno({ arquivo }: { arquivo: ArquivoInternoKey }): string {
    return carregaImagem({ src: ARQUIVOS_INTERNOS[arquivo].caminhoArquivo });
};

function getImageUrl(path: string | undefined): string {
    return `${process.env.NEXT_PUBLIC_IMAGE_API_URL}${path}`;
};