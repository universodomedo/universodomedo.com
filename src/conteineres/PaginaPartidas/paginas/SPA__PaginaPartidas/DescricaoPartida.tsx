'use client';

import styles from './styles.module.css';

import { useNoraGraphQLRegistro } from 'Hooks/useNoraGraphQLConsulta';

const SELECT_DESCRICAO = { configuracao: { narracaoInicial: true } } as const;

// Descrição da Partida no Detalhe = narracaoInicial da configuração (busca por PK). Auto-contido; keyed por idPartida no caller pra refazer ao trocar a seleção (sem remontar o painel inteiro).
export function DescricaoPartida({ idPartida }: { idPartida: number }) {
    const consulta = useNoraGraphQLRegistro('Partida', {
        props: { idPartida },
        pk: idPartida,
        select: SELECT_DESCRICAO,
        carregando: 'Carregando descrição',
        mensagemErro: 'Não foi possível carregar a descrição da Partida.',
    });
    const narracao = consulta.data?.configuracao?.narracaoInicial?.trim();

    if (consulta.carregando) return <p className={styles.info_descricao}>Carregando descrição…</p>;
    if (!narracao) return <p className={`${styles.info_descricao} ${styles.info_descricao_vazia}`}>Sem descrição definida para esta Partida.</p>;

    return <p className={styles.info_descricao}>{narracao}</p>;
};
