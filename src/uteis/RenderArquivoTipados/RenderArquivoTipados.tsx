import Image from "next/image";
import { CSSProperties } from "react";

import { ArquivoInternoDef, ArquivoInternoKey, ARQUIVOS_INTERNOS, CaminhoArquivoArte, CaminhoArquivoAvatar } from 'types-nora-api';

import { carregaArquivoInterno, getImageUrl } from 'Uteis/ImagemLoader/ImagemLoader.ts';

export function RenderArquivoInterno({ arquivoInterno, className }: { arquivoInterno: ArquivoInternoDef; className?: string }) { return <Image alt='' src={carregaArquivoInterno(arquivoInterno)} fill unoptimized className={className} />; };

export function RenderArquivoInterno2({ arquivoInterno, className, alt, style }: { arquivoInterno: ArquivoInternoKey; className?: string; alt?: string; style?: CSSProperties; }) { return <img src={getImageUrl(ARQUIVOS_INTERNOS[arquivoInterno].caminhoArquivo)} className={className} alt={alt ?? ''} style={style} />; };

export function RenderArquivoAvatar({ caminhoArquivoAvatar, className }: { caminhoArquivoAvatar: CaminhoArquivoAvatar; className?: string }) { return <Image alt='' src={getImageUrl(caminhoArquivoAvatar)} fill unoptimized className={className} />; };
export function RenderArquivoArteCapa({ caminhoArquivoArte, className }: { caminhoArquivoArte: CaminhoArquivoArte; className?: string }) { return <Image alt='' src={getImageUrl(caminhoArquivoArte)} fill unoptimized className={className} />; };
export function RenderUsuario({ caminhoArquivoAvatar, className }: { caminhoArquivoAvatar: CaminhoArquivoAvatar; className?: string }) { return <Image alt='' src={getImageUrl(caminhoArquivoAvatar)} fill unoptimized className={className} />; };

/**
 * EVITAR USAR, APENAS EM FLUXOS ESTRANHOS ONDE O ARQUIVO RENDERIZADO NÃO TEM TIPO ESTIPULADO
 * Usando na exibição de Arquivo Pendente (não tem tipo estipulado)
 */
export function RenderArquivoGENERICO({ caminhoArquivoGENERICO, className }: { caminhoArquivoGENERICO: string; className?: string }) { return <Image alt='' src={getImageUrl(caminhoArquivoGENERICO)} fill unoptimized className={className} />; };