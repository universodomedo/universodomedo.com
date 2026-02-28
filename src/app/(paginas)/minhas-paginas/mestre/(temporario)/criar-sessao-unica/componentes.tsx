'use client';

import styles from './styles.module.css';

import { PAGINAS, PersonagemDto } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaCriarSessaoUnicaProvider, DadosParticipanteTela, useContextoPaginaCriarSessaoUnica } from 'Contextos/ContextoPaginaCriarSessaoUnica/contexto';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorUsuarioEmCache from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorUsuarioEmCache/SelecionadorUsuarioEmCache';
import AlternaOpcao from 'Componentes/Elementos/Inputs/AlternaOpcao/AlternaOpcao';
import { InputData } from 'Componentes/Elementos/Inputs/InputData/InputData';
import { isMomentoFormatado24 } from 'Uteis/isMomentoFormatado24/isMomentoFormatado24';
import SelecionadorRascunho from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorRascunho/SelecionadorRascunho';
import SelecionadorPersonagem from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorPersonagem/SelecionadorPersonagem';
import { DadosResumo } from 'Componentes/Elementos/DetalhesRascunho/subcomponentes';
import { AvatarUsuarioEmVisualizacao_CACHED } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvatarUsuarioEmVisualizacao/AvatarUsuarioEmVisualizacao';

export function PaginaTemporariaCriarSessaoUnica_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre.temporario.criarSessaoUnica}>
            <ContextoPaginaCriarSessaoUnicaProvider>
                <PaginaTemporariaCriarSessaoUnica_Slot />
            </ContextoPaginaCriarSessaoUnicaProvider>
        </ControladorSlot>
    );
};

function PaginaTemporariaCriarSessaoUnica_Slot() {
    const { rascunhosDoUsuario, idsUsuariosSelecionados, dadosParticipantes, obtemListaPersonagensDoUsuario, setIdsUsuariosSelecionados, setParticipaComPersonagem, setIdPersonagemParticipante, data, setData, horaInicio, setHoraInicio, horaFim, setHoraFim, idRascunhoSelecionado, setIdRascunhoSelecionado, flagCanonico, setFlagCanonico, rascunhoSelecionado, podeCriar, criarSessao } = useContextoPaginaCriarSessaoUnica();

    return (
        <div className={styles.recipiente_pagina_criar_sessao}>
            <div className={styles.recipiente_dados_criar_sessao}>
                <div className={styles.recipiente_dados_criar_sessao__superior}>
                    <InputComRotulo rotulo={'Selecione a Data'}>
                        <InputData value={data} onChange={setData} placeholder="DD-MM-YYYY" limparHabilitado={true} />
                    </InputComRotulo>

                    <InputComRotulo rotulo={'Hora Inicio'}>
                        <input type="time" value={horaInicio} onChange={e => { const v = e.target.value; if (isMomentoFormatado24(v)) setHoraInicio(v); }} />
                    </InputComRotulo>

                    <InputComRotulo rotulo={'Hora Fim'}>
                        <input type="time" value={horaFim} onChange={e => { const v = e.target.value; if (isMomentoFormatado24(v)) setHoraFim(v); }} />
                    </InputComRotulo>

                    <InputComRotulo rotulo={'Sessão Canônica?'}>
                        <AlternaOpcao opcao={flagCanonico} onChange={setFlagCanonico} />
                    </InputComRotulo>
                </div>
                <div className={styles.recipiente_dados_criar_sessao__inferior}>
                    <div className={styles.recipiente_dados_criar_sessao__esquerda}>
                        <InputComRotulo rotulo={'Selecione os Jogadores'}>
                            <SelecionadorUsuarioEmCache isMulti idsSelecionados={idsUsuariosSelecionados} onSelectIdsUsuarios={idsUsuarios => setIdsUsuariosSelecionados(idsUsuarios)} />
                        </InputComRotulo>

                        {dadosParticipantes.length > 0 && (
                            <div className={styles.recipiente_resumo_rascunho_selecionado}>
                                {dadosParticipantes.map(dadosParticipante => <ItemDadosParticipanteSessao key={dadosParticipante.idUsuarioParticipante} dadosParticipante={dadosParticipante} personagensDoUsuario={obtemListaPersonagensDoUsuario(dadosParticipante.idUsuarioParticipante)} setParticipaComPersonagem={setParticipaComPersonagem} setIdPersonagemParticipante={setIdPersonagemParticipante} />)}
                            </div>
                        )}
                    </div>
                    <div className={styles.recipiente_dados_criar_sessao__direita}>
                        <InputComRotulo rotulo={'Selecione a Sessão'}>
                            <SelecionadorRascunho options={rascunhosDoUsuario} idSelecionado={idRascunhoSelecionado} onSelectIdRascunho={idRascunho => setIdRascunhoSelecionado(idRascunho)} />
                        </InputComRotulo>

                        {idRascunhoSelecionado !== null && (
                            <div className={styles.recipiente_resumo_rascunho_selecionado}>
                                {idRascunhoSelecionado === 'MUNDO_ABERTO' ? (
                                    <>
                                        <h1>Sessão de Mundo Aberto</h1>
                                        <h2>Sem Rascunho</h2>
                                    </>
                                ) : (
                                    <DadosResumo rascunho={rascunhoSelecionado!} />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.recipiente_pagina_criar_sessao__botoes}>
                <button disabled={!podeCriar} onClick={criarSessao}>Criar</button>
            </div>
        </div>
    );
};

function ItemDadosParticipanteSessao({ dadosParticipante, personagensDoUsuario, setParticipaComPersonagem, setIdPersonagemParticipante }: { dadosParticipante: DadosParticipanteTela; personagensDoUsuario: PersonagemDto[]; setParticipaComPersonagem: (idUsuarioParticipante: number, participaComPersonagem: boolean) => void; setIdPersonagemParticipante: (idUsuarioParticipante: number, idPersonagem: number | null) => void; }) {
    return (
        <div className={styles.recipiente_item_listagem_participante_sessao}>
            <div className={styles.recipiente_avatar_participante_sessao}>
                <AvatarUsuarioEmVisualizacao_CACHED idUsuario={dadosParticipante.idUsuarioParticipante} />
            </div>

            <InputComRotulo rotulo={'Participa com Personagem?'}>
                <AlternaOpcao opcao={dadosParticipante.participaComPersonagem} onChange={valor => setParticipaComPersonagem(dadosParticipante.idUsuarioParticipante, valor)} />
            </InputComRotulo>

            {dadosParticipante.participaComPersonagem && (
                <InputComRotulo rotulo={'Personagem'}>
                    <SelecionadorPersonagem options={personagensDoUsuario} idSelecionado={dadosParticipante.idPersonagem} onSelectIdPersonagem={idPersonagem => setIdPersonagemParticipante(dadosParticipante.idUsuarioParticipante, idPersonagem)} />
                </InputComRotulo>
            )}
        </div>
    );
};