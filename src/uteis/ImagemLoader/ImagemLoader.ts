import { ArquivoInternoDef } from "types-nora-api";

export function carregaImagem({ src }: { src: string | undefined; }): string { return getImageUrl(src); };
export function carregaArquivoInterno(arquivoInterno: ArquivoInternoDef): string { return carregaImagem({ src: arquivoInterno.caminhoArquivo }); };
export function getImageUrl(path: string | undefined): string { return `${process.env.NEXT_PUBLIC_IMAGE_API_URL}${path}`; };


export type CDN_ImageUrl = string & { readonly __brand: "CdnImageUrl" };
export function getImageUrlCdn(path: string | undefined): CDN_ImageUrl { return `${process.env.NEXT_PUBLIC_IMAGE_API_URL}${path ?? ""}` as CDN_ImageUrl; }