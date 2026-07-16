'use client';

import { useRouter } from 'next/navigation';

import styles from './styles.module.css';

// Navegacao global ate um cartao do Painel do Medo. Se o Painel ja esta montado, dispara evento custom que o contexto escuta (router.push de query nao remonta a pagina — este era o bug do botao "Ver cartão"); senao, navega de verdade e o deep-link ?card= abre a ficha no mount.
export function navegarParaCardPainelDoMedo(cardId: number, router: { push: (url: string) => void }): void {
    if (window.location.pathname.includes('/painel-do-medo')) window.dispatchEvent(new CustomEvent('painel-do-medo:abrir-card', { detail: { cardId } }));
    else router.push(`/minhas-paginas/colaborador/painel-do-medo?card=${cardId}`);
};

// Renderiza texto livre transformando "cartão #N" em trecho clicável que leva até o cartão. Uso: mensagens de notificação (toast, Central de Eventos).
export default function RefsDeCartao({ texto, aoNavegar }: { texto: string; aoNavegar?: () => void }) {
    const router = useRouter();
    const padrao = /\bcart[aã]o #(\d+)/gi;
    const partes: React.ReactNode[] = [];
    let ultimoIndice = 0;
    let ocorrencia: RegExpExecArray | null;

    while ((ocorrencia = padrao.exec(texto)) !== null) {
        if (ocorrencia.index > ultimoIndice) partes.push(texto.slice(ultimoIndice, ocorrencia.index));
        const cardId = Number(ocorrencia[1]);
        partes.push(
            <button key={`${ocorrencia.index}-${cardId}`} className={styles.refCartao} title="Ir até o cartão" onClick={evento => { evento.stopPropagation(); navegarParaCardPainelDoMedo(cardId, router); aoNavegar?.(); }}>
                {ocorrencia[0]}
            </button>,
        );
        ultimoIndice = ocorrencia.index + ocorrencia[0].length;
    }

    if (ultimoIndice < texto.length) partes.push(texto.slice(ultimoIndice));

    return <>{partes}</>;
};
