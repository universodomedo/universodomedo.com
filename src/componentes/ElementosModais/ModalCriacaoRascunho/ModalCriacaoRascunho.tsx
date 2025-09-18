'use client';

import { EstiloSessaoMestradaDto } from 'types-nora-api';

import { useContextoRascunhosMestre } from "Contextos/ContextoRascunhosMestre/contexto";
import { useContextoCriaRascunho } from 'Contextos/ContextoCriaRascunho/contexto';
import Modal from 'Componentes/Elementos/Modal/Modal.tsx';
import InputComRotulo from 'Componentes/Elementos/Inputs/InputComRotulo/InputComRotulo';

export function ModalCriacaoRascunho({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void; }) {
    const { podeCriar, handleCriar } = useContextoCriaRascunho();

    return (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Content cabecalho={ { titulo: 'Criar Rascunho' } } botaoAcaoPrincipal={{ texto: 'Criar', desabilitado: !podeCriar, execucao: handleCriar }}>
                <ConteudoModal />
            </Modal.Content>
        </Modal>
    );
};

function ConteudoModal() {
    const { estilosSessaoMestrada } = useContextoRascunhosMestre();
    const { titulo, setTitulo, idEstiloSessaoSelecionado, setIdEstiloSessaoSelecionado } = useContextoCriaRascunho();

    return (
        <>
            <InputComRotulo rotulo={'Titulo'}>
                <input id="titulo" type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} autoComplete={'off'} />
            </InputComRotulo>

            {estilosSessaoMestrada.length > 1 && (
                <InputComRotulo rotulo={'Tipo de Sessão'}>
                    <select value={idEstiloSessaoSelecionado} onChange={(e) => setIdEstiloSessaoSelecionado(Number(e.target.value))}>
                        <option value={0} disabled>Selecionar Tipo de Sessão</option>
                        {estilosSessaoMestrada.map(estilo => <option key={estilo.id} value={estilo.id}>{estilo.descricao}</option>)}
                    </select>
                </InputComRotulo>
            )}
        </>
    );
};