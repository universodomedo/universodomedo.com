import { RascunhoAventuraCompletaDto, RascunhoSessaoUnicaCanonicaCompletaDto, RascunhoSessaoUnicaNaoCanonicaCompletaDto } from 'types-nora-api';

import { useContextoRascunho } from 'Contextos/ContextoRascunho/contexto';
import { ContextoEdicaoRascunhoAventuraProvider } from 'Contextos/ContextoEdicaoRascunho/ContextoEdicaoRascunhoAventura/contexto';
import { ModalEditarRascunhoAventura } from 'Componentes/ElementosModais/ModalEditarRascunho/ModalEditarRascunhoAventura';
import { ContextoEdicaoRascunhoSessaoUnicaCanonicaProvider } from 'Contextos/ContextoEdicaoRascunho/ContextoEdicaoRascunhoSessaoUnicaCanonica/contexto';
import { ModalEditarRascunhoSessaoUnicaCanonica } from 'Componentes/ElementosModais/ModalEditarRascunho/ModalEditarRascunhoSessaoUnicaCanonica';
import { ContextoEdicaoRascunhoSessaoUnicaNaoCanonicaProvider } from 'Contextos/ContextoEdicaoRascunho/ContextoEdicaoRascunhoSessaoUnicaNaoCanonica/contexto';
import { ModalEditarRascunhoSessaoUnica } from 'Componentes/ElementosModais/ModalEditarRascunho/ModalEditarRascunhoSessaoUnica';

export default function EdicaoRascunho({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void; }) {
    const { rascunho } = useContextoRascunho();

    if (rascunho.idEstiloSessaoMestrada === 1) {
        return (
            <ContextoEdicaoRascunhoAventuraProvider rascunho={rascunho as RascunhoAventuraCompletaDto}>
                <ModalEditarRascunhoAventura isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </ContextoEdicaoRascunhoAventuraProvider>
        );
    }

    if (rascunho.idEstiloSessaoMestrada === 2) {
        return (
            <ContextoEdicaoRascunhoSessaoUnicaCanonicaProvider rascunho={rascunho as RascunhoSessaoUnicaCanonicaCompletaDto}>
                <ModalEditarRascunhoSessaoUnicaCanonica isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </ContextoEdicaoRascunhoSessaoUnicaCanonicaProvider>
        );
    }

    if (rascunho.idEstiloSessaoMestrada === 3) {
        return (
            <ContextoEdicaoRascunhoSessaoUnicaNaoCanonicaProvider rascunho={rascunho as RascunhoSessaoUnicaNaoCanonicaCompletaDto}>
                <ModalEditarRascunhoSessaoUnica isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </ContextoEdicaoRascunhoSessaoUnicaNaoCanonicaProvider>
        );
    }

    return <></>;
};