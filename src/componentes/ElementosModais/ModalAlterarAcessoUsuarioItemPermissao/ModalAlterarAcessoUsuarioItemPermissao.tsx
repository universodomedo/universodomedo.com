'use client';

import styles from './styles.module.css';

import { useState } from 'react';

import Modal from 'Componentes/Elementos/Modal/Modal';
import { useContextoAlterarEstadoUsuarioItemPermissao } from 'Contextos/ContextoAlterarEstadoUsuarioItemPermissao/contexto';

export function ModalAlterarAcessoUsuarioItemPermissao({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void }) {
    const { podeSalvar, salvando, salvar } = useContextoAlterarEstadoUsuarioItemPermissao();

    return (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Content cabecalho={{ titulo: 'Alterando Estado do Item para Usuário' }} botaoAcaoPrincipal={{ execucao: salvar, texto: salvando ? 'Salvando...' : 'Salvar', desabilitado: !podeSalvar }}>
                <ConteudoModal />
            </Modal.Content>
        </Modal>
    );
};

function ConteudoModal() {
    return (
        <h1>oi</h1>
    );
};