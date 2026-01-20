'use client';

import { ContextoCriarNovoItemPermissaoProvider } from 'Contextos/ContextoCriarNovoItemPermissao/contexto';
import { ModalCriarNovoItemPermissao } from 'Componentes/ElementosModais/ModalCriarNovoItemPermissao/ModalCriarNovoItemPermissao';

export default function CriarNovoItemPermissao({ isModalOpen, setIsModalOpen, parentIdCriacao }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void; parentIdCriacao: number | null }) {
    return (
        <ContextoCriarNovoItemPermissaoProvider isModalOpen={isModalOpen} parentIdCriacao={parentIdCriacao}>
            <ModalCriarNovoItemPermissao isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </ContextoCriarNovoItemPermissaoProvider>
    );
};