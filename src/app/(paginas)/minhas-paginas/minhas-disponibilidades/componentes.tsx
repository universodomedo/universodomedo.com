'use client';

import styles from './styles.module.css';

import { useState } from 'react';
import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoDisponibilidadeUsuarioProvider } from 'Contextos/ContextoDisponibilidadeUsuario/contexto.tsx';
import { useContextoDisponibilidadeUsuario } from 'Contextos/ContextoDisponibilidadeUsuario/contexto.tsx';
import { ConteudoModal, ListagemMinhasDisponibilidades } from './subcomponentes';
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';

export function PaginaMinhaDisponibilidade_Client() {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.minhasDisponibilidades}>
            <ContextoDisponibilidadeUsuarioProvider>
                <PaginaMinhaDisponibilidade_Contexto />
            </ContextoDisponibilidadeUsuarioProvider>
        </ControladorSlot>
    );
};

function PaginaMinhaDisponibilidade_Contexto() {
    const { minhaDisponibilidade, podeSalvar, salvarDisponibilidades } = useContextoDisponibilidadeUsuario();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);

    return (
        <>
            <div className={styles.recipiente_pagina_disponibilidades}>
                <div className={styles.recipiente_container_disponibilidade}>
                    {!minhaDisponibilidade ? <h1>Você não possui Disponibilidades configuradas no momento</h1> : <ListagemMinhasDisponibilidades />}
                </div>

                <div className={styles.recipiente_informacoes_disponibilidades}>
                    {minhaDisponibilidade && <h2>Essa Disponibilidade foi cadastrada em 02/02/2026 e será válida até 05/03/2026</h2>}
                    <button className={styles.botao_configurar_disponibilidades} onClick={openModal}>{minhaDisponibilidade ? 'Revalidar Disponibilidades' : 'Configurar Disponibilidades'}</button>
                </div>
            </div>

            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Modal.Content cabecalho={{ titulo: 'Configurando Disponibilidades' }} botaoAcaoPrincipal={{ texto: 'Salvar', execucao: salvarDisponibilidades, desabilitado: !podeSalvar }}>
                    <ConteudoModal />
                </Modal.Content>
            </Modal>
        </>
    );
};