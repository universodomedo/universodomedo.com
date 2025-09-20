import { useContextoRascunho } from 'Contextos/ContextoRascunho/contexto';
import { ContextoEdicaoRascunhoAventuraProvider } from 'Contextos/ContextoEdicaoRascunho/ContextoEdicaoRascunhoAventura/contexto';
import { ModalEditarRascunhoAventura } from 'Componentes/ElementosModais/ModalEditarRascunho/ModalEditarRascunhoAventura';
import { ContextoEdicaoRascunhoSessaoUnicaCanonicaProvider } from 'Contextos/ContextoEdicaoRascunho/ContextoEdicaoRascunhoSessaoUnicaCanonica/contexto';
import { ModalEditarRascunhoSessaoUnicaCanonica } from 'Componentes/ElementosModais/ModalEditarRascunho/ModalEditarRascunhoSessaoUnicaCanonica';
import { ContextoEdicaoRascunhoSessaoUnicaNaoCanonicaProvider } from 'Contextos/ContextoEdicaoRascunho/ContextoEdicaoRascunhoSessaoUnicaNaoCanonica/contexto';
import { ModalEditarRascunhoSessaoUnica } from 'Componentes/ElementosModais/ModalEditarRascunho/ModalEditarRascunhoSessaoUnica';

export default function EdicaoRascunho({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void }) {
    const { rascunho } = useContextoRascunho();

    if (rascunho?.estiloSessaoMestrada.id === 1) return (
        <ContextoEdicaoRascunhoAventuraProvider>
            <ModalEditarRascunhoAventura isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </ContextoEdicaoRascunhoAventuraProvider>
    );

    else if (rascunho?.estiloSessaoMestrada.id === 2) return (
        <ContextoEdicaoRascunhoSessaoUnicaCanonicaProvider>
            <ModalEditarRascunhoSessaoUnicaCanonica isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </ContextoEdicaoRascunhoSessaoUnicaCanonicaProvider>
    );

    else if (rascunho?.estiloSessaoMestrada.id === 3) return (
        <ContextoEdicaoRascunhoSessaoUnicaNaoCanonicaProvider>
            <ModalEditarRascunhoSessaoUnica isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </ContextoEdicaoRascunhoSessaoUnicaNaoCanonicaProvider>
    );

    else return <></>;
};