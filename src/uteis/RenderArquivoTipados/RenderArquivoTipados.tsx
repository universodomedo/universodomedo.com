import Image from "next/image";

import { ArquivoInternoDef, CaminhoArquivoArte, CaminhoArquivoAvatar, PathAvatarPadrao } from 'types-nora-api';

import { carregaArquivoInterno, getImageUrl } from 'Uteis/ImagemLoader/ImagemLoader.ts';

export function RenderArquivoInterno({ arquivoInterno, className }: { arquivoInterno: ArquivoInternoDef; className?: string }) { return <Image alt='' src={carregaArquivoInterno(arquivoInterno)} fill unoptimized className={className} />; };
export function RenderArquivoAvatar({ caminhoArquivoAvatar, className }: { caminhoArquivoAvatar: CaminhoArquivoAvatar; className?: string }) { return <Image alt='' src={getImageUrl(caminhoArquivoAvatar)} fill unoptimized className={className} />; };
export function RenderArquivoArteCapa({ caminhoArquivoArte, className }: { caminhoArquivoArte: CaminhoArquivoArte; className?: string }) { return <Image alt='' src={getImageUrl(caminhoArquivoArte)} fill unoptimized className={className} />; };
export function RenderUsuario({ caminhoArquivoAvatar, className }: { caminhoArquivoAvatar: CaminhoArquivoAvatar; className?: string }) { return <Image alt='' src={PathAvatarPadrao} fill unoptimized className={className} />; };

/**
 * EVITAR USAR, APENAS EM FLUXOS ESTRANHOS ONDE O ARQUIVO RENDERIZADO NÃO TEM TIPO ESTIPULADO
 * Usando na exibição de Arquivo Pendente (não tem tipo estipulado)
 */
export function RenderArquivoGENERICO({ caminhoArquivoGENERICO, className }: { caminhoArquivoGENERICO: string; className?: string }) { return <Image alt='' src={getImageUrl(caminhoArquivoGENERICO)} fill unoptimized className={className} />; };