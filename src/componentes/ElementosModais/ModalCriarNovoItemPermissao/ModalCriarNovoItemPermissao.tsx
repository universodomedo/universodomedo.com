'use client';

import styles from './styles.module.css';

import { useContextoCriarNovoItemPermissao } from 'Contextos/ContextoCriarNovoItemPermissao/contexto';
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';

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

function ConteudoModal() {
    const { paiCriacao, labelPaiCriacao, codigo, setCodigo, descricao, setDescricao, codigoValido, descricaoValida } = useContextoCriarNovoItemPermissao();

    return (
        <div className={styles.form}>
            <div className={styles.bloco_pai}>
                <div className={styles.bloco_pai_titulo}>Pai</div>

                {paiCriacao ? (
                    <div className={styles.bloco_pai_card}>
                        <div className={styles.bloco_pai_codigo}>{paiCriacao.codigo}</div>
                        <div className={styles.bloco_pai_descricao}>{paiCriacao.descricao}</div>
                        <div className={styles.bloco_pai_path}>{paiCriacao.path}</div>
                    </div>
                ) : (
                    <div className={styles.bloco_pai_raiz}>{labelPaiCriacao}</div>
                )}
            </div>

            <div className={styles.campo}>
                <label className={styles.label}>Código</label>
                <input className={styles.input} value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="EX: ADMINISTRADOR" />
                {!codigoValido ? <div className={styles.dica}>Use apenas A-Z e _ (será salvo em maiúsculo)</div> : null}
            </div>

            <div className={styles.campo}>
                <label className={styles.label}>Descrição</label>
                <input className={styles.input} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição obrigatória" />
                {!descricaoValida ? <div className={styles.dica}>Descrição é obrigatória</div> : null}
            </div>
        </div>
    );
};