import { useContextoRascunho } from 'Contextos/ContextoRascunho/contexto';
import { ContextoEdicaoRascunhoSessaoUnicaNaoCanonicaProvider } from 'Contextos/ContextoEdicaoRascunho/ContextoEdicaoRascunhoSessaoUnicaNaoCanonica/contexto';
import { ModalEditarRascunhoSessaoUnica } from 'Componentes/ElementosModais/ModalEditarRascunho/ModalEditarRascunhoSessaoUnica';

export default function EdicaoRascunho({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void }) {
    const { rascunho } = useContextoRascunho();

    if (rascunho.tipoRascunho.id === 1) return (<></>);

    else if (rascunho.tipoRascunho.id === 2) return (<></>);

    else if (rascunho.tipoRascunho.id === 3) return (
        <ContextoEdicaoRascunhoSessaoUnicaNaoCanonicaProvider>
            <ModalEditarRascunhoSessaoUnica isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </ContextoEdicaoRascunhoSessaoUnicaNaoCanonicaProvider>
    );

    else return <></>;
};