'use client';

import styles from './styles.module.css';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaCriarSessaoUnicaProvider, useContextoPaginaCriarSessaoUnica } from 'Contextos/ContextoPaginaCriarSessaoUnica/contexto';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import SelecionadorUsuarioEmCache from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorUsuarioEmCache/SelecionadorUsuarioEmCache';
import { InputData } from 'Componentes/Elementos/Inputs/InputData/InputData';
import { isMomentoFormatado24 } from 'Uteis/isMomentoFormatado24/isMomentoFormatado24';
import SelecionadorRascunho from 'Componentes/Elementos/Inputs/Selecionadores/SelecionadorRascunho/SelecionadorRascunho';
import { DadosResumo } from 'Componentes/Elementos/DetalhesRascunho/subcomponentes';

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
    const { rascunhosDoUsuario, setIdsUsuariosSelecionados, data, setData, horaInicio, setHoraInicio, horaFim, setHoraFim, idRascunhoSelecionado, setIdRascunhoSelecionado, rascunhoSelecionado, podeCriar, criarSessao } = useContextoPaginaCriarSessaoUnica();

    return (
        <div className={styles.recipiente_pagina_criar_sessao}>
            <div className={styles.recipiente_dados_criar_sessao}>
                <div className={styles.recipiente_dados_criar_sessao__esquerda}>
                    <InputComRotulo rotulo={'Selecione os Jogadores'}>
                        <SelecionadorUsuarioEmCache isMulti onSelectIdsUsuarios={idsUsuarios => setIdsUsuariosSelecionados(idsUsuarios)} />
                    </InputComRotulo>

                    <InputComRotulo rotulo={'Selecione a Data'}>
                        <InputData value={data} onChange={setData} placeholder="DD-MM-YYYY" limparHabilitado={true} />
                    </InputComRotulo>

                    <InputComRotulo rotulo={'Hora Inicio'}>
                        <input type="time" value={horaInicio} onChange={e => { const v = e.target.value; if (isMomentoFormatado24(v)) setHoraInicio(v); }} />
                    </InputComRotulo>

                    <InputComRotulo rotulo={'Hora Fim'}>
                        <input type="time" value={horaFim} onChange={e => { const v = e.target.value; if (isMomentoFormatado24(v)) setHoraFim(v); }} />
                    </InputComRotulo>
                </div>
                <div className={styles.recipiente_dados_criar_sessao__direita}>
                    <InputComRotulo rotulo={'Selecione a Sessão'}>
                        <SelecionadorRascunho options={rascunhosDoUsuario} idSelecionado={idRascunhoSelecionado} onSelectIdRascunho={idRascunho => setIdRascunhoSelecionado(idRascunho)} />
                    </InputComRotulo>

                    {rascunhoSelecionado && (
                        <div className={styles.recipiente_resumo_rascunho_selecionado}>
                            <DadosResumo rascunho={rascunhoSelecionado} />
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.recipiente_pagina_criar_sessao__botoes}>
                <button disabled={!podeCriar} onClick={criarSessao}>Criar</button>
            </div>
        </div>
    );
};