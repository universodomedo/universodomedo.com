'use client';

import styles from './InspecaoOcupanteMapaLogico.module.css';

import { useContextoTelaDeJogoMapaLogico } from './ContextoTelaDeJogoMapaLogico';

export function InspecaoOcupanteMapaLogico() {
    const { estadoCarregamento, mapaLogicoSalaJogo, ocupanteSelecionado, limpaSelecaoOcupante } = useContextoTelaDeJogoMapaLogico();

    if (estadoCarregamento !== 'pronto' || mapaLogicoSalaJogo === null) return null;

    if (ocupanteSelecionado === null) {
        return <aside className={styles.painel_inspecao_vazio}>Selecione um ocupante no mapa para inspecionar seu estado funcional.</aside>;
    }

    return (
        <aside className={styles.painel_inspecao}>
            <header className={styles.cabecalho_inspecao}>
                <div>
                    <strong>{ocupanteSelecionado.nomeExibicao}</strong>
                    <span>Ficha #{ocupanteSelecionado.idFicha} · {ocupanteSelecionado.posicao.x},{ocupanteSelecionado.posicao.y}</span>
                    <small>{ocupanteSelecionado.keySer}</small>
                </div>
                <button type="button" onClick={limpaSelecaoOcupante} aria-label="Limpar seleção do ocupante">Fechar</button>
            </header>

            <section className={styles.secao_inspecao}>
                <h3>Capacidades funcionais</h3>
                <div className={styles.lista_compacta}>{ocupanteSelecionado.capacidadesFuncionais.map(capacidade => <span key={capacidade.key}>{capacidade.nome}</span>)}</div>
            </section>

            <section className={styles.secao_inspecao}>
                <h3>Recursos funcionais</h3>
                <div className={styles.lista_recursos}>{ocupanteSelecionado.recursosFuncionais.map(recurso => (
                    <article key={recurso.key}>
                        <strong>{recurso.nome}</strong>
                        <span>{recurso.grupoFuncional.nome} · {recurso.estadoResumo.nome}</span>
                        <small>{recurso.descricaoEstado}</small>
                        <small>{recurso.podeUsarEmAcoes ? 'Pode ser usado em ações' : 'Não pode ser usado em ações'}</small>
                    </article>
                ))}</div>
            </section>

            <section className={styles.secao_inspecao}>
                <h3>Ações disponíveis</h3>
                <div className={styles.lista_acoes}>{ocupanteSelecionado.acoesDisponiveis.map(acao => <span key={acao.key} className={acao.habilitado ? styles.acao_habilitada : styles.acao_bloqueada}>{acao.nome} · {acao.habilitado ? 'Disponível' : 'Bloqueada'}</span>)}</div>
            </section>
        </aside>
    );
};
