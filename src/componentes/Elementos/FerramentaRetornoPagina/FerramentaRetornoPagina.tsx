import styles from './styles.module.css';

import Link from 'next/link';

export default function FerramentaRetornoPagina({ hrefPaginaRetorno }: { hrefPaginaRetorno: string }) {
    return (
        <Link className={styles.link_retorno} href={hrefPaginaRetorno}>
            <div id={styles.recipiente_icone_acao_voltar_pagina_aventuras} title='Voltar'>
                <span>x</span>
            </div>
        </Link>
    );
};