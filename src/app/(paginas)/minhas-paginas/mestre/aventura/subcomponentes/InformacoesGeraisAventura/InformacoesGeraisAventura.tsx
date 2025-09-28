'use client';

import styles from './styles.module.css';

import { EstadoSessao, FormatoMomento } from 'types-nora-api';

import { useContextoPaginaMestreAventura } from "Contextos/ContextoMestreAventura/contexto";
import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo";
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import { formataDuracao } from 'Uteis/FormatadorDeMomento/FormatadorDeMomento';
import { formataData } from 'Uteis/FormatadorDeDatas/FormatadorDeDatas';

export function InformacoesGeraisAventura() {
    const { grupoAventuraSelecionada } = useContextoPaginaMestreAventura();

    return (
        <div id={styles.recipiente_informacoes_gerais_aventura}>
            <InformacoesAventura />
            {grupoAventuraSelecionada.dataQueIniciou !== null && <ListaDeTodasAsSessoes />}
        </div>
    );
};

function InformacoesAventura() {
    const { grupoAventuraSelecionada } = useContextoPaginaMestreAventura();

    return (
        <SecaoDeConteudo id={styles.recipiente_informacoes_aventura}>
            <h1>Aventura {grupoAventuraSelecionada.estadoAtual}</h1>
            <div id={styles.recipiente_container_informacoes_aventura}>
                {grupoAventuraSelecionada.dataPrevisaoInicio === null
                    ? <h4>Sem Previsão de Início</h4>
                    : <h4>Prevista de Iniciar em {formataData(grupoAventuraSelecionada.dataPrevisaoInicio, 'dd/MM/yyyy', true)}</h4>
                }

                {grupoAventuraSelecionada.dataQueIniciou !== null && <h4>Iniciada em {formataData(grupoAventuraSelecionada.dataQueIniciou, 'dd/MM/yyyy HH:mm')}</h4>}
                {grupoAventuraSelecionada.dataQueEncerrou !== null && <h4>Finalizada em {formataData(grupoAventuraSelecionada.dataQueEncerrou, 'dd/MM/yyyy HH:mm')}</h4>}
                {grupoAventuraSelecionada.duracaoGrupoAventuraEmSegundos && <h4>{grupoAventuraSelecionada.numeroSessoesFinalizadasGrupoAventura} Sessões, totalizando {formataDuracao(grupoAventuraSelecionada.duracaoGrupoAventuraEmSegundos, FormatoMomento.EXTENSO)}</h4>}
            </div>
        </SecaoDeConteudo>
    );
};

function ListaDeTodasAsSessoes() {
    const { grupoAventuraSelecionada } = useContextoPaginaMestreAventura();

    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <SecaoDeConteudo id={styles.recipiente_lista_todas_sessoes} {...scrollableProps}>
            <div id={styles.recipiente_container_lista_todas_sessoes}>
                {grupoAventuraSelecionada.detalhesSessoesAventuras.sort((a, b) => b.sessao.id - a.sessao.id).map(detalheSessaoAventura => (
                    <CustomLink key={detalheSessaoAventura.sessao.id} href={`/minhas-paginas/mestre/sessao/${detalheSessaoAventura.sessao.id}`}>
                        <div className={styles.recipiente_linha_episodio_em_lista}>
                            <h4>{detalheSessaoAventura.episodioPorExtenso}</h4>
                            {detalheSessaoAventura.sessao.estadoAtual === EstadoSessao.MARCADA
                                ? <h4>Prevista para {formataData(detalheSessaoAventura.sessao.dataPrevisaoInicio, 'dd/MM/yyyy HH:mm')}</h4>
                                : detalheSessaoAventura.sessao.estadoAtual === EstadoSessao.EM_ANDAMENTO ? <h4>Em andamento</h4>
                                    : <h4>Ocorreu em {formataData(detalheSessaoAventura.sessao.dataInicio!, 'dd/MM/yyyy HH:mm')}</h4>
                            }
                        </div>
                    </CustomLink>
                ))}
            </div>
        </SecaoDeConteudo>
    );
};