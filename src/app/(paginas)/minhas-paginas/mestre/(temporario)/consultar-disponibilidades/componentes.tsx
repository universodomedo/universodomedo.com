'use client';

import styles from './styles.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import cn from 'classnames';
import { JanelaDisponibilidadeCompletaDto, PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoConsultarDisponibilidadesProvider, useContextoConsultarDisponibilidades } from 'Contextos/ContextoConsultarDisponibilidades/contexto';
import { useContextoConsultarDisponibilidades_Listagem } from 'Contextos/ContextoConsultarDisponibilidades_Listagem/contexto';
import SecaoDeConteudo from 'Componentes/ElementosVisuais/SecaoDeConteudo/SecaoDeConteudo';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { isMomentoFormatado24 } from 'Uteis/isMomentoFormatado24/isMomentoFormatado24';
import SelecionadorDiaDaSemana from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorDiaDaSemana/SelecionadorDiaDaSemana';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';
import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import { copiarParaClipboard } from 'Uteis/copiarParaClipboard/copiarParaClipboard';

export function PaginaTemporariaConsultarDisponibilidades_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre.temporario.consultarDisponibilidades}>
            <ContextoConsultarDisponibilidadesProvider>
                <PaginaTemporariaConsultarDisponibilidades_Contexto />
            </ContextoConsultarDisponibilidadesProvider>
        </ControladorSlot>
    );
};

function PaginaTemporariaConsultarDisponibilidades_Contexto() {
    const { janelas } = useContextoConsultarDisponibilidades_Listagem();

    return (
        <div className={styles.recipiente_pai_consultar_disponibilidades}>
            <div className={styles.recipiente_consultar_disponibilidades}>
                <FiltroBuscaDisponibilidades />

                {janelas && <ListagemJanelas janelas={janelas} />}
            </div>
        </div>
    );
};

function FiltroBuscaDisponibilidades() {
    const { filtroDiaDaSemana, setFiltroDiaDaSemana, filtroHoraInicio, setFiltroHoraInicio, filtroHoraFim, setFiltroHoraFim, buscaAventurasPorFiltro } = useContextoConsultarDisponibilidades();

    return (
        <SecaoDeConteudo className={styles.recipiente_buscador_disponibilidade}>
            <div className={styles.recipiente_inputs_consultar_disponibilidades}>
                <InputComRotulo rotulo={'Dia da semana'}>
                    <SelecionadorDiaDaSemana diaSelecionado={filtroDiaDaSemana} onSelectDiaDaSemana={setFiltroDiaDaSemana} />
                </InputComRotulo>

                <InputComRotulo rotulo={'Hora Inicio'}>
                    <input type="time" value={filtroHoraInicio} onChange={(e) => { const v = e.target.value; if (isMomentoFormatado24(v)) setFiltroHoraInicio(v); }} />
                </InputComRotulo>

                <InputComRotulo rotulo={'Hora Fim'}>
                    <input type="time" value={filtroHoraFim} onChange={(e) => { const v = e.target.value; if (isMomentoFormatado24(v)) setFiltroHoraFim(v); }} />
                </InputComRotulo>
            </div>

            <button onClick={buscaAventurasPorFiltro}>Buscar</button>
        </SecaoDeConteudo>
    );
};

function ListagemJanelas({ janelas }: { janelas: JanelaDisponibilidadeCompletaDto[] }) {
    const { scrollableProps } = useScrollable({ modo: 'sempreVisivel' });
    const { isEmFoco, toggleFoco } = useContextoConsultarDisponibilidades_Listagem();

    return (
        <div className={styles.recipiente_pai_listagem_janelas} {...scrollableProps}>
            {janelas.length < 1 ? (
                <h2>Nenhuma Janela Disponível para esse Filtro</h2>
            ) : (
                <div className={styles.recipiente_listagem_janelas}>
                    {janelas.map(janela => {
                        const emFoco = isEmFoco(janela.id);

                        return (
                            <div key={janela.id} className={styles.recipiente_item_individual_listagem_janelas}>
                                <div className={styles.recipiente_avatar}>
                                    <AvatarUsuarioEmVisualizacao_CACHED idUsuario={janela.disponibilidadeUsuario.usuario.id} />
                                </div>
                                <div className={styles.recipiente_dados_usuario_listagem_janelas}>
                                    <div className={styles.recipiente_dados_principais_usuario_listagem_janelas}>
                                        <h2>{janela.disponibilidadeUsuario.usuario.username}</h2>
                                        <div className={styles.recipiente_copiar_discordId_usuario}>
                                            <FontAwesomeIcon icon={emFoco ? faCaretDown : faCaretUp} title={emFoco ? 'Remover Foco' : 'Aplicar Foco'} className={cn(emFoco && styles.com_foco)} onClick={(e) => { e.stopPropagation(); toggleFoco(janela.id); }} />
                                            <FontAwesomeIcon icon={faDiscord} title={'Copiar Id do Discord'} onClick={async (e) => { e.stopPropagation(); await copiarParaClipboard(janela.disponibilidadeUsuario.usuario.discordId); }} />
                                        </div>
                                    </div>
                                    <div className={styles.recipiente_dados_disponibilidade_usuario_listagem_janelas}>
                                        <h3>{janela.janelaPorExtenso}</h3>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};