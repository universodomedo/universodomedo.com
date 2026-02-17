'use client';

import styles from './styles.module.css';

import { useState } from 'react';

import { CabecalhoModalProps } from '../Modal/Modal';
import ModalSelecionarImagem from 'Componentes/ElementosModais/ModalSelecionarImagem/ModalSelecionarImagem';

export default function ConfiguradorCapa({ cabecalho, callbackSelecionaArquivo }: { cabecalho: CabecalhoModalProps, callbackSelecionaArquivo: (idArquivoSelecionado: number) => void }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    
    return (
        <>
            <button className={styles.botao_selecionar_capa} onClick={openModal}>Selecionar Capa</button>

            <ModalSelecionarImagem isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} cabecalho={cabecalho} callbackSelecionaArquivo={callbackSelecionaArquivo} />
        </>
    );
};