import styles from './styles.module.css';

import CatalogoDeMissoes from 'Componentes/ElementosDeJogo/CatalogoDeMissoes/CatalogoDeMissoes';
import type { Contexto__PaginaModoSolo__Props } from 'Contextos/Contexto__PaginaModoSolo/contexto';

export default function SPA__PaginaModoSolo({ catalogosDisponiveis, idMissaoSelecionada, carregando, erro, selecionarMissao }: Contexto__PaginaModoSolo__Props) {
    return (
        <main className={styles.pagina_modo_solo}>
            {erro && <div className={styles.erro}>{erro}</div>}
            <section className={styles.secao_detalhamento} aria-hidden="true" />
            <section className={styles.secao_catalogo}><CatalogoDeMissoes catalogos={catalogosDisponiveis} idMissaoSelecionada={idMissaoSelecionada} carregando={carregando} aoSelecionarMissao={missao => selecionarMissao(missao.id)} /></section>
        </main>
    );
};
