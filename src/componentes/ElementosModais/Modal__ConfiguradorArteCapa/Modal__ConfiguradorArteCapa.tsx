'use client';

import styles from './styles.module.css';

import { useContexto__Modal__ConfiguradorArteCapa } from '@/contextos/Contexto__Modal__ConfiguradorArteCapa/contexto';
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';

export default function Modal__ConfiguradorArteCapa({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void; }) {
    const { callbackConfigArteCapa } = useContexto__Modal__ConfiguradorArteCapa();
    
    return (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Content cabecalho={ { titulo: 'Teste' } } botaoAcaoPrincipal={{ texto: 'Criar', desabilitado: false, execucao: () => {console.log('xauu')} }}>
                <ConteudoModal />
            </Modal.Content>
        </Modal>
    );
};

function ConteudoModal() {
    return (
        <>
            <h1>ASGOIH</h1>
        </>
    );
};