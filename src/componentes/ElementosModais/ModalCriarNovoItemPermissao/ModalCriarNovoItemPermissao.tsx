'use client';

import styles from './styles.module.css';

import { useContextoCriarNovoItemPermissao } from 'Contextos/ContextoCriarNovoItemPermissao/contexto';
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import { CampoInputComDica, CampoModal, CampoPai } from 'Componentes/ElementosVisuais/Permissoes/Modais/componentes';

export function ModalCriarNovoItemPermissao({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void }) {
    const { podeSalvar, salvando, salvar } = useContextoCriarNovoItemPermissao();

    return (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Content cabecalho={{ titulo: 'Criar novo Item Permissão' }} botaoAcaoPrincipal={{ execucao: salvar, texto: salvando ? 'Salvando...' : 'Salvar', desabilitado: !podeSalvar }}>
                <ConteudoModal />
            </Modal.Content>
        </Modal>
    );
};

//

function ConteudoModal() {
    const { paiCriacao, codigo, setCodigo, descricao, setDescricao, codigoValido, descricaoValida } = useContextoCriarNovoItemPermissao();

    return (
        <div className={styles.recipiente_criacao_novo_item_permissao}>
            <CampoModal label="Pai">
                <CampoPai itemPermissao={paiCriacao} />
            </CampoModal>

            <CampoModal label="Código">
                <CampoInputComDica value={codigo} onChangeValue={setCodigo} placeholder="EX: ADMINISTRADOR" valido={codigoValido} dica="Use apenas A-Z e _ (será salvo em maiúsculo)" />
            </CampoModal>

            <CampoModal label="Descrição">
                <CampoInputComDica value={descricao} onChangeValue={setDescricao} placeholder="Descrição obrigatória" valido={descricaoValida} dica="Descrição é obrigatória" />
            </CampoModal>
        </div>
    );
};