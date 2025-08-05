'use client';

import styles from './styles.module.css';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useContextoPaginaMestreAventura } from "Contextos/ContextoMestreAventura/contexto";
import SecaoDeConteudo from "Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo";
import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { encerrarSessaoEmAndamentoDeGrupoAventura } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { DetalheSessaoCanonicaDto, EstadoSessao } from 'types-nora-api';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';

export function PaginaMestreAventura_Slot() {
    return (
        <CabecalhoMestreAventura />
    );
};

function CabecalhoMestreAventura() {
    const { aventuraSelecionada } = useContextoPaginaMestreAventura();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);

    return (
        <>
            <SecaoDeConteudo id={styles.recipiente_capa_pagina_aventura_mestre}>
                <div id={styles.recipiente_imagem_capa_pagina_aventura_mestre}>
                    <RecipienteImagem src={aventuraSelecionada.imagemCapa?.fullPath} />
                </div>
            </SecaoDeConteudo>

            <SecaoDeConteudo id={styles.recipiente_nome_aventura}>
                <h1>{aventuraSelecionada.gruposAventura![0].nomeUnicoGrupoAventura}</h1>
            </SecaoDeConteudo>

            <VisualizadorUltimasSessoes detalhesUltimasSessoes={aventuraSelecionada.gruposAventura![0].detalhesSessaoesCanonicas.sort((a, b) => a.sessao.id - b.sessao.id).slice(-2)} />

            <SecaoDeConteudo id={styles.recipiente_acoes_aventura}>
                <button disabled={aventuraSelecionada.gruposAventura![0].sessaoMaisRecente?.estadoAtual !== EstadoSessao.EM_ANDAMENTO} onClick={openModal}>Finalizar Sessão em Aberto</button>
            </SecaoDeConteudo>

            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Modal.Content title={'Encerrar Sessão em Aberto'}>
                    <ConteudoModal />
                </Modal.Content>
            </Modal>
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
                        {detalheUltimasSessoes.sessao.dataFim ? (
                            <h4>Finalizou {format(new Date(detalheUltimasSessoes.sessao.dataFim), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</h4>
                        ) : (
                            <h4>Não Finalizado</h4>
                        )}
                    </div>
                </div>
            </SecaoDeConteudo>
        </CustomLink>
    );
};

function ConteudoModal() {
    const { aventuraSelecionada } = useContextoPaginaMestreAventura();
    const [criaNovaSessao, setCriaNovaSessao] = useState<boolean>(false);

    const executaEncerrarSessaoEmAndamentoDeGrupoAventura = async () => {
        await encerrarSessaoEmAndamentoDeGrupoAventura(aventuraSelecionada.gruposAventura![0].id, criaNovaSessao);
        window.location.reload();
    }

    return (
        <div id={styles.recipiente_modal_encerramento_de_sessao_em_aberto}>
            <p>Criar próxima sessão automaticamente?</p>
            <label style={{ display: 'block', margin: '5px 0' }}>
                <input
                    type="radio"
                    checked={criaNovaSessao}
                    onChange={() => setCriaNovaSessao(true)}
                    style={{ marginRight: '5px' }}
                />
                Sim
            </label>

            <label style={{ display: 'block', margin: '5px 0' }}>
                <input
                    type="radio"
                    checked={!criaNovaSessao}
                    onChange={() => setCriaNovaSessao(false)}
                    style={{ marginRight: '5px' }}
                />
                Não
            </label>
            <button onClick={() => executaEncerrarSessaoEmAndamentoDeGrupoAventura()}>Encerrar</button>
        </div>
    );
};