import { NoraApi } from 'Api/NoraApi';
import { EventosApiRest, type AssinaturaArtistaPersistida, type FonteAssinaturaArtista, type PAYLOAD__SalvarAssinaturaArtista } from 'types-nora-api';

export function obtemMinhaAssinatura(): Promise<AssinaturaArtistaPersistida | null> {
    return NoraApi.RestGET(EventosApiRest.GET.AssinaturaArtista.minha, {}, { mensagemErro: 'Não foi possível carregar sua assinatura.' });
};

export function salvaMinhaAssinatura(payload: PAYLOAD__SalvarAssinaturaArtista): Promise<AssinaturaArtistaPersistida> {
    return NoraApi.RestPOST(EventosApiRest.POST.AssinaturaArtista.salvar, payload, { mensagemErro: 'Não foi possível salvar sua assinatura.' });
};

// Fontes script curadas (Google Fonts) para a assinatura digital. `familia` = font-family CSS.
export const FONTES_ASSINATURA: Record<FonteAssinaturaArtista, { readonly rotulo: string; readonly familia: string }> = {
    GREAT_VIBES: { rotulo: 'Great Vibes', familia: "'Great Vibes', cursive" },
    DANCING_SCRIPT: { rotulo: 'Dancing Script', familia: "'Dancing Script', cursive" },
    ALLURA: { rotulo: 'Allura', familia: "'Allura', cursive" },
    SACRAMENTO: { rotulo: 'Sacramento', familia: "'Sacramento', cursive" },
    PACIFICO: { rotulo: 'Pacifico', familia: "'Pacifico', cursive" },
};

export const FONTES_ASSINATURA_LISTA: readonly FonteAssinaturaArtista[] = ['GREAT_VIBES', 'DANCING_SCRIPT', 'ALLURA', 'SACRAMENTO', 'PACIFICO'];

export const HREF_GOOGLE_FONTS_ASSINATURA = 'https://fonts.googleapis.com/css2?family=Allura&family=Dancing+Script&family=Great+Vibes&family=Pacifico&family=Sacramento&display=swap';
