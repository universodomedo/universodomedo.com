'use client';

import { ContextoAlterarEstadoUsuarioItemPermissaoProvider } from 'Contextos/ContextoAlterarEstadoUsuarioItemPermissao/contexto';
import { ModalAlterarAcessoUsuarioItemPermissao } from 'Componentes/ElementosModais/ModalAlterarAcessoUsuarioItemPermissao/ModalAlterarAcessoUsuarioItemPermissao';

export default function AlterarEstadoUsuarioItemPermissao({ isModalOpen, setIsModalOpen, idItemPermissaoSendoAlterado }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void; idItemPermissaoSendoAlterado: number | null; }) {
    if (!idItemPermissaoSendoAlterado) return <></>;

    return (
        <ContextoAlterarEstadoUsuarioItemPermissaoProvider isModalOpen={isModalOpen} idItemPermissaoSendoAlterado={idItemPermissaoSendoAlterado}>
            <ModalAlterarAcessoUsuarioItemPermissao isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </ContextoAlterarEstadoUsuarioItemPermissaoProvider>
    );
};