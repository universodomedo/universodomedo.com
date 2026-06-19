import styles from './styles.module.css';

import type { CSSProperties } from 'react';

export type MissaoCatalogoDeMissoes = {
    readonly id: number;
    readonly nome: string;
    readonly descricao: string;
};

export type CatalogoDeMissoesItem = {
    readonly id: number;
    readonly nome: string;
    readonly missoes: readonly MissaoCatalogoDeMissoes[];
};

type CatalogoDeMissoesProps = {
    readonly catalogos: readonly CatalogoDeMissoesItem[];
    readonly idMissaoSelecionada: number | null;
    readonly carregando: boolean;
    readonly aoSelecionarMissao: (missao: MissaoCatalogoDeMissoes) => void;
};

type EstiloItemOrbital = CSSProperties & {
    readonly '--indice-catalogo': number;
    readonly '--indice-missao': number;
};

export default function CatalogoDeMissoes({ catalogos, idMissaoSelecionada, carregando, aoSelecionarMissao }: CatalogoDeMissoesProps) {
    const totalMissoes = catalogos.reduce((total, catalogo) => total + catalogo.missoes.length, 0);

    if (carregando) {
        return (
            <section className={`${styles.catalogo_de_missoes} ${styles.catalogo_de_missoes_vazio}`}>
                <div className={styles.estado_catalogo}>
                    <strong>Carregando missões</strong>
                    <span>Aguarde um instante.</span>
                </div>
            </section>
        );
    }

    if (totalMissoes === 0) {
        return (
            <section className={`${styles.catalogo_de_missoes} ${styles.catalogo_de_missoes_vazio}`}>
                <div className={styles.estado_catalogo}>
                    <strong>Não há missões disponíveis</strong>
                    <span>Volte em breve para novos desafios solo.</span>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.catalogo_de_missoes} aria-label="Catálogo de Missões">
            <div className={styles.trilho_orbital} aria-hidden="true" />
            <div className={styles.lista_catalogos}>
                {catalogos.map((catalogo, indiceCatalogo) => <GrupoCatalogo key={catalogo.id} catalogo={catalogo} indiceCatalogo={indiceCatalogo} idMissaoSelecionada={idMissaoSelecionada} aoSelecionarMissao={aoSelecionarMissao} />)}
            </div>
        </section>
    );
};

function GrupoCatalogo({ catalogo, indiceCatalogo, idMissaoSelecionada, aoSelecionarMissao }: { readonly catalogo: CatalogoDeMissoesItem; readonly indiceCatalogo: number; readonly idMissaoSelecionada: number | null; readonly aoSelecionarMissao: (missao: MissaoCatalogoDeMissoes) => void; }) {
    return (
        <section className={styles.grupo_catalogo}>
            <header className={styles.cabecalho_catalogo}>
                <strong>{catalogo.nome}</strong>
                <span className={styles.marcador_catalogo} aria-hidden="true" />
            </header>

            <div className={styles.lista_missoes}>
                {catalogo.missoes.length === 0 && <div className={styles.catalogo_vazio}>Sem missões neste catálogo</div>}
                {catalogo.missoes.map((missao, indiceMissao) => {
                    const selecionada = missao.id === idMissaoSelecionada;
                    const estilo: EstiloItemOrbital = { '--indice-catalogo': indiceCatalogo, '--indice-missao': indiceMissao };

                    return (
                        <button key={missao.id} type="button" className={`${styles.item_missao} ${selecionada ? styles.item_missao_selecionada : ''}`} style={estilo} onClick={() => aoSelecionarMissao(missao)}>
                            <span className={styles.textos_missao}>
                                <strong>{missao.nome}</strong>
                                <span>{missao.descricao}</span>
                            </span>
                            <span className={styles.icone_missao} aria-hidden="true" />
                        </button>
                    );
                })}
            </div>
        </section>
    );
};
