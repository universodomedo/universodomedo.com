'use client';

import styles from './styles.module.css';

import { useContextoRascunho } from "Contextos/ContextoRascunho/contexto";
import { useContextoEdicaoRascunhoSessaoUnicaNaoCanonica } from 'Contextos/ContextoEdicaoRascunhoSessaoUnicaNaoCanonica/contexto';
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputNumerico from 'Componentes/Elementos/Inputs/InputNumerico/InputNumerico';
import { useCache } from 'Redux/hooks/useCache';
import InputTextoTiptap from 'Componentes/Elementos/Tiptap/InputTextoTiptap/InputTextoTiptap';
import AlternaOpcao from 'Componentes/Elementos/Inputs/AlternaOpcao/AlternaOpcao';

export function ModalEditarRascunho({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean, setIsModalOpen: (open: boolean) => void }) {
    const { rascunho } = useContextoRascunho();
    const { handleSalvar, podeSalvar } = useContextoEdicaoRascunhoSessaoUnicaNaoCanonica();

    return (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Content cabecalho={{ titulo: `Editando Rascunho`, subtitulo: rascunho.titulo }} botaoAcaoPrincipal={{ execucao: handleSalvar, texto: 'Salvar', desabilitado: !podeSalvar }}>
                <ConteudoModal />
            </Modal.Content>
        </Modal>
    );
};

function ConteudoModal() {
    const { niveis, dificuldadesSessao, tiposSessao } = useCache();
    const { seNumeroJogadoresTemLimiteMax, setSeNumeroJogadoresTemLimiteMax, numeroJogadoresMin, setNumeroJogadoresMin, numeroJogadoresMax, setNumeroJogadoresMax, idNivelSelecionado, setIdNivelSelecionado, idDificuldadeSelecionado, setIdDificuldadeSelecionada, idTipoSelecionado, setIdTipoSelecionada, descricao, setDescricao } = useContextoEdicaoRascunhoSessaoUnicaNaoCanonica();

    return (
        <div id={styles.recipiente_corpo_modal_edita_rascunho}>
            <div className={styles.recipiente_parametros_rascunho}>
                <div className={styles.recipiente_maximo_jogadores_aberto}>
                    <InputComRotulo rotulo={'Possui Máximo de Vagas?'}>
                        <AlternaOpcao opcao={seNumeroJogadoresTemLimiteMax} onChange={setSeNumeroJogadoresTemLimiteMax} />
                    </InputComRotulo>
                </div>
                <div className={styles.recipiente_inputs_numero_jogadores}>
                    <InputComRotulo rotulo={'Mínimo'}>
                        <InputNumerico min={1} step={1} value={numeroJogadoresMin} onChange={setNumeroJogadoresMin} />
                    </InputComRotulo>
                    {seNumeroJogadoresTemLimiteMax && (
                        <InputComRotulo rotulo={'Máximo'}>
                            <InputNumerico min={numeroJogadoresMin} step={1} value={numeroJogadoresMax} onChange={setNumeroJogadoresMax} disabled={!seNumeroJogadoresTemLimiteMax} />
                        </InputComRotulo>
                    )}
                </div>
            </div>

            <div className={styles.recipiente_parametros_rascunho}>
                <InputComRotulo rotulo={'Grau de Ex.P. dos Personangens'}>
                    <select value={idNivelSelecionado} onChange={e => setIdNivelSelecionado(Number(e.target.value))}>
                        <option value="0" disabled >Selecionar Nível dos Personagens</option>
                        {niveis!.map(nivel => (<option key={nivel.id} value={nivel.id}>{nivel.nomeVisualizacao}</option>))}
                    </select>
                </InputComRotulo>
            </div>

            <div className={styles.recipiente_parametros_rascunho}>
                <InputComRotulo rotulo={'Dificuldade da Sessão'} >
                    <select value={idDificuldadeSelecionado} onChange={e => setIdDificuldadeSelecionada(Number(e.target.value))}>
                        <option value="0" disabled >Selecionar Dificuldade da Sessão</option>
                        {dificuldadesSessao!.map(dificuldade => (<option key={dificuldade.id} value={dificuldade.id}>{dificuldade.descricao}</option>))}
                    </select>
                </InputComRotulo>

                <InputComRotulo rotulo={'Tipo de Sessão'}>
                    <select value={idTipoSelecionado} onChange={e => setIdTipoSelecionada(Number(e.target.value))}>
                        <option value="0" disabled >Selecionar Tipo de Sessão</option>
                        {tiposSessao!.map(tipo => (<option key={tipo.id} value={tipo.id}>{tipo.descricao}</option>))}
                    </select>
                </InputComRotulo>
            </div>

            <div className={styles.recipiente_area_texto_tiptap}>
                <InputComRotulo rotulo={'Descrição'} classname={styles.input_com_rotulo_texto}>
                    <InputTextoTiptap conteudo={descricao} onChange={setDescricao} />
                </InputComRotulo>
            </div>
        </div>
    );
};