import styles from './styles.module.css';

import type { AcaoDisponivel } from 'types-nora-api';

import { useContextoFichaDePersonagem } from 'Contextos/ContextoFichaDePersonagem/contexto';
import { useContextoControleAcoesRuntime } from 'Contextos/ContextosControladorSwiperFicha/ContextoControleAcoesRuntime/contexto';

export default function PaginaControleAcoes() {
    const { acoes, desativarAcoes } = useContextoFichaDePersonagem();
    const { executaAcao } = useContextoControleAcoesRuntime();
    const acoesPorStatus = separaAcoesPorHabilitacao(acoes);

    return (
        <div className={styles.painel_acoes}>
            {acoesPorStatus.realizaveis.length > 0 && <SecaoAcoesFicha titulo="Ações Realizáveis" acoes={acoesPorStatus.realizaveis} desativarAcoes={desativarAcoes} executaAcao={executaAcao} />}
            {acoesPorStatus.bloqueadas.length > 0 && <SecaoAcoesFicha titulo="Ações Bloqueadas" acoes={acoesPorStatus.bloqueadas} desativarAcoes={desativarAcoes} executaAcao={executaAcao} />}
        </div>
    );
};

function SecaoAcoesFicha({ titulo, acoes, desativarAcoes, executaAcao }: { titulo: string; acoes: AcaoDisponivel[]; desativarAcoes: boolean; executaAcao: (keyAcao: string) => void; }) {
    return (
        <section className={styles.secao_acoes}>
            <h3 className={styles.titulo_secao}>{titulo}</h3>
            <div className={styles.lista_acoes}>
                {acoes.map(acao => <AcaoEmFicha key={acao.key} acao={acao} desativarAcoes={desativarAcoes} executaAcao={executaAcao} />)}
            </div>
        </section>
    );
};

function AcaoEmFicha({ acao, desativarAcoes, executaAcao }: { acao: AcaoDisponivel; desativarAcoes: boolean; executaAcao: (keyAcao: string) => void; }) {
    const acaoPodeExecutar = acao.habilitado && !desativarAcoes;
    const status = acao.habilitado ? 'Realizável' : 'Bloqueada';

    function acionar(): void {
        if (!acaoPodeExecutar) return;
        executaAcao(acao.key);
    };

    return (
        <button type="button" className={`${styles.acao} ${acao.habilitado ? styles.acao_realizavel : styles.acao_bloqueada} ${!acaoPodeExecutar ? styles.acao_sem_interacao : ''}`} aria-disabled={!acaoPodeExecutar} aria-label={`${acao.nome} - ${status}`} onClick={acionar}>
            <span className={styles.icone_acao} aria-hidden="true">A</span>
            <span className={styles.resumo_acao} role="tooltip">
                <strong>{acao.nome}</strong>
                <span>{acao.origemExibicao.nome}</span>
                <span>{status}</span>
                <span className={styles.lista_requisitos}>
                    {acao.requisitos.length === 0 && <span>Sem requisitos adicionais</span>}
                    {acao.requisitos.map(requisito => <span key={requisito.descricao} className={requisito.cumprido ? styles.requisito_cumprido : styles.requisito_bloqueado}>{requisito.descricao}</span>)}
                </span>
                <small>{acao.key}</small>
            </span>
        </button>
    );
};

function separaAcoesPorHabilitacao(acoes: AcaoDisponivel[]): { realizaveis: AcaoDisponivel[]; bloqueadas: AcaoDisponivel[]; } {
    return {
        realizaveis: acoes.filter(acao => acao.habilitado),
        bloqueadas: acoes.filter(acao => !acao.habilitado),
    };
};
