'use client';

import styles from './styles.module.css';

import type { PartidaGraphqlDto } from 'types-nora-api';
import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';

// Forma achatada da condicaoVitoria vinda da leitura GraphQL (tipo + campos de todas as variantes nullable). DERIVADA do DTO gerado, não recriada.
type CondicaoVitoriaGraphql = NonNullable<PartidaGraphqlDto['configuracao']>['condicaoVitoria'];

const SELECT_CONTEUDO = {
    configuracao: {
        narracaoInicial: true,
        condicaoVitoria: { tipo: true, keySerEmSala: true, idEstatisticaDanificavel: true, tempoAlvoMs: true, distanciaMaximaMilimetros: true },
    },
} as const;

// Conteúdo do corpo derivado da configuração da Partida: descrição (narracaoInicial) + Condição de Vitória. Busca por PK; keyed por idPartida no caller pra refazer ao trocar a seleção.
export function ConteudoConfiguracaoPartida({ idPartida }: { idPartida: number }) {
    const consulta = useNoraGraphQLRegistro('Partida', {
        props: { idPartida },
        pk: idPartida,
        select: SELECT_CONTEUDO,
        carregando: 'Carregando detalhes',
        mensagemErro: 'Não foi possível carregar os detalhes da Partida.',
    });
    const configuracao = consulta.data?.configuracao;

    if (consulta.carregando) return <p className={styles.info_descricao}>Carregando detalhes…</p>;
    if (consulta.erro || !configuracao) return <p className={`${styles.info_descricao} ${styles.info_descricao_vazia}`}>Sem detalhes definidos para esta Partida.</p>;

    const narracao = configuracao.narracaoInicial?.trim();

    return (
        <>
            {narracao
                ? <p className={styles.info_descricao}>{narracao}</p>
                : <p className={`${styles.info_descricao} ${styles.info_descricao_vazia}`}>Sem descrição definida.</p>}

            <hr className={styles.divisoria_h} />

            <section className={styles.secao_corpo}>
                <div className={styles.secao_cabecalho}>
                    <span className={styles.secao_icone} aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" strokeLinecap="round" /></svg>
                    </span>
                    <h3 className={styles.secao_rotulo}>Condição de Vitória</h3>
                </div>
                <ul className={styles.lista_condicao}>
                    <li className={styles.item_condicao}>{textoCondicaoVitoria(configuracao.condicaoVitoria)}</li>
                </ul>
            </section>
        </>
    );
};

function textoCondicaoVitoria(condicao: CondicaoVitoriaGraphql): string {
    switch (condicao.tipo) {
        case 'inimigo_derrotado': return 'Derrotar o inimigo.';
        case 'refem_percebido': return 'Encontrar e perceber o refém.';
        case 'tempo_jogo_alcancado': return `Sobreviver por ${formataDuracao(condicao.tempoAlvoMs)}.`;
        case 'proximidade_ser_alcancada': return `Alcançar o alvo (até ${condicao.distanciaMaximaMilimetros ?? 0} mm).`;
        case 'qualquer_acao_executada': return 'Executar qualquer ação.';
        default: return 'Condição de vitória não definida.';
    }
};

function formataDuracao(ms: number | null): string {
    const totalSegundos = Math.max(1, Math.round((ms ?? 0) / 1000));
    if (totalSegundos < 60) return `${totalSegundos}s`;
    return `${Math.round(totalSegundos / 60)} min`;
};
