'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { AventuraEstado, FormatoMomento, GrupoAventura_DetalhesSessoes, PAGINAS, SessaoEmGrupoAventura, SessaoGraphqlDto } from 'types-nora-api';

import { useContexto__PaginaMestreAventuras__ComAventuraSelecionada } from "Contextos/Contexto__PaginaMestreAventuras__ComAventuraSelecionada/contextos";
import { useConfigurarLayoutContextualizado } from "Redux/hooks/useLayoutContextualizado";
import RenderCabecalhoCapa from '@/componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/CabecalhoDeAventura/CabecalhoDeAventura';
import { formataData } from 'Uteis/FormatadorDeDatas/FormatadorDeDatas';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import Modal from 'Componentes/Elementos/Modal/Modal';
import { encerraGrupoAventura } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import useScrollable from '@/componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import { formataDuracao } from '@/uteis/FormatadorDeMomento/FormatadorDeMomento';

export default function SPA__PaginaMestreAventuras__SemAventuraSelecionada() {
    const { grupoAventuraSelecionado, deselecionaGrupoAventura } = useContexto__PaginaMestreAventuras__ComAventuraSelecionada();

    useConfigurarLayoutContextualizado({ titulo: grupoAventuraSelecionado.nomeUnicoGrupoAventura, fecharProps: { tipo: 'acao', executar: () => { deselecionaGrupoAventura() }, tituloTooltip: 'Voltar' } }, 'patch');

    return (
        <div className={styles.recipiente_aventura_selecionada}>
            <RenderCabecalhoCapa caminhoArquivoArte={grupoAventuraSelecionado.dadosArteCapa.caminhoArquivoArteCapa} configArteCapa={{ callback: () => { console.log(`oi`) }, subtituloOperacao: grupoAventuraSelecionado.nomeUnicoGrupoAventura }} />

            {grupoAventuraSelecionado.detalhesSessoes.estadoAtual === AventuraEstado.EM_ANDAMENTO && <VisualizadorSessoes idGrupoAventura={grupoAventuraSelecionado.id} detalhesSessoes={grupoAventuraSelecionado.detalhesSessoes} />}

            <InformacoesGeraisAventura detalhesSessoes={grupoAventuraSelecionado.detalhesSessoes} />
        </div>
    );
};

function VisualizadorSessoes({ idGrupoAventura, detalhesSessoes }: { idGrupoAventura: number; detalhesSessoes: GrupoAventura_DetalhesSessoes; }) {
    return (
        <>
            <div id={styles.recipiente_visualizador_sessoes}>
                {detalhesSessoes.listaSessoesGrupoAventura.sort((a, b) => a.id - b.id).slice(-2).map(sessao => (
                    <VisualizacaoInformacoesSessao key={sessao.id} sessao={sessao} />
                ))}
            </div>
            {detalhesSessoes.sessaoFinal === null && <AcoesSessoesRecentesDeAventurasEmAndamento idGrupoAventura={idGrupoAventura} />}
        </>
    );
};

function VisualizacaoInformacoesSessao({ sessao }: { sessao: SessaoEmGrupoAventura }) {
    return (
        <CustomLink className={styles.recipiente_link_sessao} destino={{ pagina: PAGINAS.minhasPaginas.mestre.sessao, params: { id: sessao.id } }} semDecoracao>
            <SecaoDeConteudo className={styles.recipiente_informacoes_sessao}>
                <div className={styles.recipiente_cabecalho_informacoes_sessao}>
                    <h1>{sessao.episodioPorExtenso}</h1>
                    <h4>{sessao.estadoAtual}</h4>
                </div>

                <div className={styles.recipiente_par_informacao}>
                    <div className={styles.recipiente_informacoes}>
                        <h4>Previsto: {formataData(sessao.dataPrevisaoInicio, 'dd/MM/yyyy HH:mm')}</h4>
                        {sessao.dataInicio ? (
                            <h4>Iniciou {formataData(sessao.dataInicio, 'dd/MM/yyyy HH:mm')}</h4>
                        ) : (
                            <h4>Não Iniciado</h4>
                        )}
                    </div>
                    <div className={styles.recipiente_informacoes}>
                        {sessao.dataQueEncerrou ? (
                            <h4>Finalizou {formataData(sessao.dataQueEncerrou, 'dd/MM/yyyy HH:mm')}</h4>
                        ) : (
                            <h4>Não Finalizado</h4>
                        )}
                    </div>
                </div>
            </SecaoDeConteudo>
        </CustomLink>
    );
};

function AcoesSessoesRecentesDeAventurasEmAndamento({ idGrupoAventura }: { idGrupoAventura: number; }) {
    const [isModalMarcaFimOpen, setIsModalMarcaFimOpen] = useState(false);
    const openModalMarcaFim = () => setIsModalMarcaFimOpen(true);

    const executaMarcarSessaoComoUltimaDeGrupoAventura = async () => {
        await encerraGrupoAventura(idGrupoAventura);
        window.location.reload();
    }

    return (
        <SecaoDeConteudo id={styles.recipiente_acoes_aventura}>
            <button onClick={openModalMarcaFim}>Marcar Episódio como Final</button>

            <Modal open={isModalMarcaFimOpen} onOpenChange={setIsModalMarcaFimOpen}>
                <Modal.Content cabecalho={{ titulo: 'Marcar Sessão como Final da Aventura' }}>
                    <div id={styles.recipiente_modal_marcar_sessao_como_final}>
                        <button onClick={() => executaMarcarSessaoComoUltimaDeGrupoAventura()}>Marcar Sessão como Ultima da Aventura</button>
                    </div>
                </Modal.Content>
            </Modal>
        </SecaoDeConteudo>
    );
};

function InformacoesGeraisAventura({ detalhesSessoes }: { detalhesSessoes: GrupoAventura_DetalhesSessoes; }) {
    return (
        <div id={styles.recipiente_informacoes_gerais_aventura}>
            <InformacoesAventura detalhesSessoes={detalhesSessoes} />
            {detalhesSessoes.dataQueIniciou !== null && <ListaDeTodasAsSessoes detalhesSessoes={detalhesSessoes} />}
        </div>
    );
};

function InformacoesAventura({ detalhesSessoes }: { detalhesSessoes: GrupoAventura_DetalhesSessoes; }) {
    return (
        <SecaoDeConteudo id={styles.recipiente_informacoes_aventura}>
            <h1>Aventura {detalhesSessoes.estadoAtual}</h1>
            <div id={styles.recipiente_container_informacoes_aventura}>
                {/* {detalhesSessoes.dataPrevisaoInicio === null
                    ? <h4>Sem Previsão de Início</h4>
                    : <h4>Prevista de Iniciar em {formataData(detalhesSessoes.dataPrevisaoInicio, 'dd/MM/yyyy', true)}</h4>
                } */}

                {detalhesSessoes.dataQueIniciou !== null && <h4>Iniciada em {formataData(detalhesSessoes.dataQueIniciou, 'dd/MM/yyyy HH:mm')}</h4>}
                {detalhesSessoes.dataQueEncerrou !== null && <h4>Finalizada em {formataData(detalhesSessoes.dataQueEncerrou, 'dd/MM/yyyy HH:mm')}</h4>}
                {detalhesSessoes.duracaoTotalEmSegundos && <h4>{detalhesSessoes.numeroSessoesFinalizadas} Sessões, totalizando {formataDuracao(detalhesSessoes.duracaoTotalEmSegundos, FormatoMomento.EXTENSO)}</h4>}
            </div>
        </SecaoDeConteudo>
    );
};

function ListaDeTodasAsSessoes({ detalhesSessoes }: { detalhesSessoes: GrupoAventura_DetalhesSessoes; }) {
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });

    return (
        <SecaoDeConteudo id={styles.recipiente_lista_todas_sessoes} {...scrollableProps}>
            <div id={styles.recipiente_container_lista_todas_sessoes}>
                {detalhesSessoes.listaSessoesGrupoAventura.sort((a, b) => b.id - a.id).map(sessao => (
                    <CustomLink key={sessao.id} destino={{ pagina: PAGINAS.minhasPaginas.mestre.sessao, params: { id: sessao.id } }}>
                        <div className={styles.recipiente_linha_episodio_em_lista}>
                            <h4>{sessao.episodioPorExtenso}</h4>
                            <h4>{sessao.detalheData}</h4>
                        </div>
                    </CustomLink>
                ))}
            </div>
        </SecaoDeConteudo>
    );
};