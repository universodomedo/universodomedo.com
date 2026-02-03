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


export type CDN_ImageUrl = string & { readonly __brand: "CdnImageUrl" };
export function getImageUrlCdn(path: string | undefined): CDN_ImageUrl { return `${process.env.NEXT_PUBLIC_IMAGE_API_URL}${path ?? ""}` as CDN_ImageUrl; }