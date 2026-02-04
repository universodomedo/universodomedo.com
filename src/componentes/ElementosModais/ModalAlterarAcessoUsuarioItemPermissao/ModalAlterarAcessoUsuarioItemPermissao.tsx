'use client';

import styles from './styles.module.css';

import { PERMISSOES_ESTADOS } from 'types-nora-api';

import { useContextoPaginaPermissoesUsuarios } from 'Contextos/ContextoPaginaPermissoesUsuarios/contexto';
import { useContextoAlterarEstadoUsuarioItemPermissao } from 'Contextos/ContextoAlterarEstadoUsuarioItemPermissao/contexto';
import Modal from 'Componentes/Elementos/Modal/Modal';
import { useContextoAcessoDeUsuarioEmItem } from 'Contextos/ContextoAcessoDeUsuarioEmItem/contexto';
import { CampoModal, CampoPai } from 'Componentes/ElementosVisuais/Permissoes/Modais/componentes';

export function ModalAlterarAcessoUsuarioItemPermissao({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void }) {
    const { usuarioSelecionado } = useContextoPaginaPermissoesUsuarios();
    const { podeSalvar, salvando, salvar } = useContextoAlterarEstadoUsuarioItemPermissao();

    return (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Content cabecalho={{ titulo: 'Alterando Estado do Item para Usuário', subtitulo: `Usuário [#${usuarioSelecionado?.id}]: [${usuarioSelecionado?.username}]` }} botaoAcaoPrincipal={{ execucao: salvar, texto: salvando ? 'Salvando...' : 'Salvar', desabilitado: !podeSalvar }}>
                <ConteudoModal />
            </Modal.Content>
        </Modal>
    );
};

function ConteudoModal() {
    const { itemSendoAlterado, estadoAtualItemSendoAlterado } = useContextoAcessoDeUsuarioEmItem();
    const { estadoSelecionado, setEstadoSelecionado } = useContextoAlterarEstadoUsuarioItemPermissao();

    const valorSelect = estadoSelecionado ? String(Object.keys(PERMISSOES_ESTADOS).find(k => PERMISSOES_ESTADOS[k as keyof typeof PERMISSOES_ESTADOS].id === estadoSelecionado.id) ?? '') : (estadoAtualItemSendoAlterado ? String(Object.keys(PERMISSOES_ESTADOS).find(k => PERMISSOES_ESTADOS[k as keyof typeof PERMISSOES_ESTADOS].id === estadoAtualItemSendoAlterado.id) ?? '') : '');

    return (
        <>
            <div className={styles.recipiente_alteracao_estado_item_permissao}>
                <CampoModal label="Permissão">
                    <CampoPai itemPermissao={itemSendoAlterado} />
                </CampoModal>
            </div>

            <div className={styles.recipiente_estados_em_alteracao}>
                <div className={styles.recipiente_estado_individual_em_alteracao}>
                    <h3>Estado Atual</h3>

                    <h4>{estadoAtualItemSendoAlterado ? estadoAtualItemSendoAlterado.chave : 'Sem Registro'}</h4>
                </div>
                <div className={styles.recipiente_estado_individual_em_alteracao}>
                    <h3>Estado Atualizado</h3>
                    <select value={valorSelect} onChange={e => setEstadoSelecionado(e.target.value ? PERMISSOES_ESTADOS[e.target.value as keyof typeof PERMISSOES_ESTADOS] : null)}>
                        <option value="" disabled>Selecione um estado</option>
                        {(Object.keys(PERMISSOES_ESTADOS) as (keyof typeof PERMISSOES_ESTADOS)[]).sort((a, b) => PERMISSOES_ESTADOS[a].id - PERMISSOES_ESTADOS[b].id).map(chave => (
                            <option key={chave} value={String(chave)} disabled={PERMISSOES_ESTADOS[chave].id === estadoAtualItemSendoAlterado?.id}>
                                {chave}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    );
};