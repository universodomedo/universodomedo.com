'use client';

import styles from './styles.module.css';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DetalheSessaoCanonicaDto } from 'types-nora-api';

import { useContextoPaginaMestreAventura } from "Contextos/ContextoMestreAventura/contexto";
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo";
import { BotaoFinalizarSessao } from '../BotaoFinalizarSessao/BotaoFinalizarSessao';
import { BotaoMarcarSessaoFinal } from '../BotaoMarcarSessaoFinal/BotaoMarcarSessaoFinal';

export function VisualizadorSessoes() {
    const { grupoAventuraSelecionada } = useContextoPaginaMestreAventura();

    return (
        <>
            <VisualizadorUltimasSessoes detalhesUltimasSessoes={grupoAventuraSelecionada.detalhesSessoesCanonicas.sort((a, b) => a.sessao.id - b.sessao.id).slice(-2)} />
            <AcoesSessoesRecentesDeAventurasEmAndamento />
        </>
    );
};

function VisualizadorUltimasSessoes({ detalhesUltimasSessoes }: { detalhesUltimasSessoes: DetalheSessaoCanonicaDto[] }) {
    return (
        <div id={styles.recipiente_visualizador_sessoes}>
            {detalhesUltimasSessoes.map(detalheUltimasSessoes => (
                <VisualizacaoInformacoesSessao key={detalheUltimasSessoes.sessao.id} detalheUltimasSessoes={detalheUltimasSessoes} />
            ))}
        </div>
    );
};

function VisualizacaoInformacoesSessao({ detalheUltimasSessoes }: { detalheUltimasSessoes: DetalheSessaoCanonicaDto }) {
    return (
        <CustomLink className={styles.recipiente_link_sessao} href={`/mestre/sessao/${detalheUltimasSessoes.sessao.id}`} semDecoracao>
            <SecaoDeConteudo className={styles.recipiente_informacoes_sessao}>
                <div className={styles.recipiente_cabecalho_informacoes_sessao}>
                    <h1>{detalheUltimasSessoes.episodioPorExtenso}</h1>
                    <h4>{detalheUltimasSessoes.sessao.estadoAtual}</h4>
                </div>

                <div className={styles.recipiente_par_informacao}>
                    <div className={styles.recipiente_informacoes}>
                        <h4>Previsto: {format(new Date(detalheUltimasSessoes.sessao.dataPrevisaoInicio), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</h4>
                        {detalheUltimasSessoes.sessao.dataInicio ? (
                            <h4>Iniciou {format(new Date(detalheUltimasSessoes.sessao.dataInicio), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</h4>
                        ) : (
                            <h4>Não Iniciado</h4>
                        )}
                    </div>
                    <div className={styles.recipiente_informacoes}>
                        {detalheUltimasSessoes.sessao.dataQueEncerrou ? (
                            <h4>Finalizou {format(new Date(detalheUltimasSessoes.sessao.dataQueEncerrou), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</h4>
                        ) : (
                            <h4>Não Finalizado</h4>
                        )}
                    </div>
                </div>
            </SecaoDeConteudo>
        </CustomLink>
    );
};

function AcoesSessoesRecentesDeAventurasEmAndamento() {
    return (
        <SecaoDeConteudo id={styles.recipiente_acoes_aventura}>
            <>
                <BotaoFinalizarSessao />
                <BotaoMarcarSessaoFinal />
            </>
        </SecaoDeConteudo>
    );
};