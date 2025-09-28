'use client';

import styles from './styles.module.css';

import { useContextoRascunho } from "Contextos/ContextoRascunho/contexto";
import { useContextoEdicaoRascunhoSessaoUnicaCanonica } from 'Contextos/ContextoEdicaoRascunho/ContextoEdicaoRascunhoSessaoUnicaCanonica/contexto';
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import { useCache } from 'Redux/hooks/useCache';
import InputTextoTiptap from 'Componentes/Elementos/Tiptap/InputTextoTiptap/InputTextoTiptap';

export function ModalEditarRascunhoSessaoUnicaCanonica({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean, setIsModalOpen: (open: boolean) => void }) {
    const { rascunho } = useContextoRascunho();
    const { handleSalvar, podeSalvar } = useContextoEdicaoRascunhoSessaoUnicaCanonica();

    return (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Content cabecalho={{ titulo: `Editando Rascunho`, subtitulo: rascunho?.titulo }} botaoAcaoPrincipal={{ execucao: handleSalvar, texto: 'Salvar', desabilitado: !podeSalvar }}>
                <ConteudoModal />
            </Modal.Content>
        </Modal>
    );
};

function ConteudoModal() {
    const { dificuldadesSessao, tiposSessao } = useCache();
    const { idDificuldadeSelecionado, setIdDificuldadeSelecionada, idTipoSelecionado, setIdTipoSelecionada, descricao, setDescricao } = useContextoEdicaoRascunhoSessaoUnicaCanonica();

    return (
        <div id={styles.recipiente_corpo_modal_edita_rascunho}>
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