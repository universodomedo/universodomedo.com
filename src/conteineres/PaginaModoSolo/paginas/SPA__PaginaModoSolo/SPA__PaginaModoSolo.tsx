import styles from './styles.module.css';

import CatalogoDeMissoes from 'Componentes/ElementosDeJogo/CatalogoDeMissoes/CatalogoDeMissoes';
import type { Contexto__PaginaModoSolo__Props } from 'Contextos/Contexto__PaginaModoSolo/contexto';

export default function SPA__PaginaModoSolo({ catalogosDisponiveis, idMissaoSelecionada, podeIniciarMissaoSelecionada, carregando, iniciandoMissao, erro, selecionarMissao, iniciarMissaoSelecionada }: Contexto__PaginaModoSolo__Props) {
    return (
        <div className={styles.pagina_modo_solo}>
            {erro && <div className={styles.erro}>{erro}</div>}
            <section className={styles.secao_detalhamento}>
                <button type="button" className={styles.botao_iniciar_missao} disabled={!podeIniciarMissaoSelecionada || iniciandoMissao || carregando} onClick={iniciarMissaoSelecionada}>
                    {iniciandoMissao ? 'Iniciando...' : 'Iniciar missão'}
                </button>
            </section>
            <section className={styles.secao_catalogo}><CatalogoDeMissoes catalogos={catalogosDisponiveis} idMissaoSelecionada={idMissaoSelecionada} carregando={carregando} aoSelecionarMissao={missao => selecionarMissao(missao.id)} /></section>
        </div>
    );
};
