'use client';

import styles from './styles.module.css';
import { useState } from 'react';

import { useContextoDisponibilidadeUsuario } from 'Contextos/ContextoDisponibilidadeUsuario/contexto.tsx';
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import { ConteudoModal, ListagemMinhasDisponibilidades } from './subcomponentes';

export function PaginaMinhaDisponibilidade_Contexto() {
    const { minhaDisponibilidade } = useContextoDisponibilidadeUsuario();
    const { salvarDisponibilidades, podeSalvar } = useContextoDisponibilidadeUsuario();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);

    return (
        <div id={styles.recipiente_pagina_disponibilidades}>
            <div id={styles.recipiente_container_disponibilidade}>
                <div id={styles.recipiente_disponibilidade_superior}>
                    <h1>Minha Disponibilidade</h1>
                    <button id={styles.botao_configurar_disponibilidades} onClick={openModal}>Configurar Disponibilidades</button>
                </div>
                <div id={styles.recipiente_disponibilidade_inferior}>
                    {!minhaDisponibilidade?.estaConfigurado ? <h1>Você não possui Disponibilidades configuradas no momento</h1> : <ListagemMinhasDisponibilidades />}
                </div>
            </div>

            <div id={styles.recipiente_mensagem_disponibilidade}>
                <h2>As Disponibilidades cadastradas devem atender o período de 22/09 até 07/12</h2>
            </div>

            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Modal.Content cabecalho={{ titulo: 'Configurando Disponibilidades' }} botaoAcaoPrincipal={{ texto: 'Salvar', execucao: salvarDisponibilidades, desabilitado: !podeSalvar }}>
                    <ConteudoModal />
                </Modal.Content>
            </Modal>
        </div>
    );
};