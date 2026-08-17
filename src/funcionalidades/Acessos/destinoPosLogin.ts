const PARAMETRO_DESTINO = 'next';

/** Rotas que não fazem sentido como destino de retorno (voltar para elas após logar recriaria o ciclo de acesso). */
const ROTAS_DE_ACESSO = ['/acessar', '/cadastrar', '/login'];

/** Monta o href de /acessar preservando para onde a pessoa estava indo, para o login devolvê-la ao destino original. */
export function montaHrefAcessarComDestino(destinoPretendido: string): string {
    if (ROTAS_DE_ACESSO.some(rota => destinoPretendido.startsWith(rota))) return '/acessar';
    return `/acessar?${PARAMETRO_DESTINO}=${encodeURIComponent(destinoPretendido)}`;
};

/** Lê o destino de retorno da URL atual. Só aceita caminho interno absoluto (começa com '/' e não com '//'), para não virar open redirect. */
export function leDestinoPosLogin(): string | null {
    if (typeof window === 'undefined') return null;

    const destino = new URLSearchParams(window.location.search).get(PARAMETRO_DESTINO);
    if (destino === null || !destino.startsWith('/') || destino.startsWith('//')) return null;
    if (ROTAS_DE_ACESSO.some(rota => destino.startsWith(rota))) return null;

    return destino;
};