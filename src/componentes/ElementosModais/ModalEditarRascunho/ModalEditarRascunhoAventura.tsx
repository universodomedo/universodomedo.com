'use client';

import styles from './styles.module.css';

import { useContextoRascunho } from "Contextos/ContextoRascunho/contexto";
import { useContextoEdicaoRascunhoAventura } from 'Contextos/ContextoEdicaoRascunho/ContextoEdicaoRascunhoAventura/contexto';
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';
import InputTextoTiptap from 'Componentes/Elementos/Tiptap/InputTextoTiptap/InputTextoTiptap';

export function ModalEditarRascunhoAventura({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean, setIsModalOpen: (open: boolean) => void }) {
    const { rascunho } = useContextoRascunho();
    const { handleSalvar, podeSalvar } = useContextoEdicaoRascunhoAventura();

    return (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Content cabecalho={{ titulo: `Editando Rascunho`, subtitulo: rascunho?.titulo }} botaoAcaoPrincipal={{ execucao: handleSalvar, texto: 'Salvar', desabilitado: !podeSalvar }}>
                <ConteudoModal />
            </Modal.Content>
        </Modal>
    );
};

function ConteudoModal() {
    const { descricao, setDescricao } = useContextoEdicaoRascunhoAventura();

    return (
        <div id={styles.recipiente_corpo_modal_edita_rascunho}>
            <div className={styles.recipiente_area_texto_tiptap}>
                <InputComRotulo rotulo={'Descrição'} classname={styles.input_com_rotulo_texto}>
                    <InputTextoTiptap conteudo={descricao} onChange={setDescricao} />
                </InputComRotulo>
            </div>
        </div>
    );
};