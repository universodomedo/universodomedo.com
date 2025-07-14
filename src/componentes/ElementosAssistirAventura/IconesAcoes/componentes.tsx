import styles from './styles.module.css';

import Link from 'next/link';
import { useContextoPaginaAventura } from 'Contextos/ContextoPaginaAventura/contexto';

export function IconeAcaoVoltarPaginaAventuras() {
    return (
        <div id={styles.recipiente_icone_acao_voltar_pagina_aventuras} title='Voltar para Aventuras'>
            <Link href={'/aventuras'}><span>x</span></Link>
        </div>
    );
};

export function IconeAcaoBuscarSessaoAnterior() {
    const { podeAlterarSessaoManualmente, alteraSessaoManualmente } = useContextoPaginaAventura();

    return (
        <div className={`${styles.recipiente_icone_buscar_acao_manualmente} ${styles.sessao_anterior} ${!podeAlterarSessaoManualmente.podeBuscarAnterior ? styles.acao_desabilitada : ''}`} title='Sessão Anterior' onClick={() => alteraSessaoManualmente('anterior')}>
            <span>←</span>
        </div>
    );
};

export function IconeAcaoBuscarSessaoSeguinte() {
    const { podeAlterarSessaoManualmente, alteraSessaoManualmente } = useContextoPaginaAventura();

    return (
        <div className={`${styles.recipiente_icone_buscar_acao_manualmente} ${styles.sessao_seguinte} ${!podeAlterarSessaoManualmente.podeBuscarSeguinte ? styles.acao_desabilitada : ''}`} title='Sessão Seguinte' onClick={() => alteraSessaoManualmente('seguinte')}>
            <span>→</span>
        </div>
    );
};