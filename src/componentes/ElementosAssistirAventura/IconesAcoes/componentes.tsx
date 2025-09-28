import styles from './styles.module.css';

import { DivClicavel } from 'Componentes/Elementos/DivClicavel/DivClicavel';
import { useContextoPaginaAventura } from 'Contextos/ContextoPaginaAventura/contexto';

export function IconeAcaoBuscarSessaoAnterior() {
    const { podeAlterarSessaoManualmente, alteraSessaoManualmente } = useContextoPaginaAventura();

    return (
        <DivClicavel className={`${styles.recipiente_icone_buscar_acao_manualmente} ${styles.sessao_anterior}`} title='Sessão Anterior' classeParaDesabilitado={styles.acao_desabilitada} desabilitado={!podeAlterarSessaoManualmente.podeBuscarAnterior} onClick={() => alteraSessaoManualmente('anterior')}>
            <span>←</span>
        </DivClicavel>
    );
};

export function IconeAcaoBuscarSessaoSeguinte() {
    const { podeAlterarSessaoManualmente, alteraSessaoManualmente } = useContextoPaginaAventura();

    return (
        <DivClicavel className={`${styles.recipiente_icone_buscar_acao_manualmente} ${styles.sessao_seguinte}`} title='Sessão Seguinte' classeParaDesabilitado={styles.acao_desabilitada} desabilitado={!podeAlterarSessaoManualmente.podeBuscarSeguinte} onClick={() => alteraSessaoManualmente('seguinte')}>
            <span>→</span>
        </DivClicavel>
    );
};