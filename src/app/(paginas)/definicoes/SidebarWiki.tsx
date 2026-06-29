import Link from 'next/link';
import { SecaoWiki } from 'types-nora-api';

import { obtemNavegacaoWiki } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import styles from './sidebarWiki.module.css';

export default async function SidebarWiki({ listaSlug, base = '/definicoes', inicioLabel = 'Início', inicioHref = '/definicoes', secao = 'definicao', titulo = 'Definições' }: { listaSlug: string[]; base?: string; inicioLabel?: string; inicioHref?: string; secao?: SecaoWiki; titulo?: string }) {
    const itens = await obtemNavegacaoWiki(secao);
    const chaveAtual = listaSlug.length > 0 ? listaSlug.map(decodeURIComponent).join('/') : '';

    return (
        <nav className={styles.sidebar}>
            <h2 className={styles.titulo_nav}>{titulo}</h2>

            <ul className={styles.lista}>
                <li>
                    <Link className={`${styles.item} ${chaveAtual === '' ? styles.item_ativo : ''}`} href={inicioHref}>{inicioLabel}</Link>
                </li>

                {itens.map(item => (
                    <li key={item.chave}>
                        <Link className={`${styles.item} ${chaveAtual === item.chave ? styles.item_ativo : ''}`} href={`${base}/${item.chave}`}>{item.titulo}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};