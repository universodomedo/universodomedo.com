'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { EstiloSessaoMestradaDto } from 'types-nora-api';

import { me_salvarRascunho } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { ModalCriacaoRascunho } from 'Componentes/ElementosModais/ModalCriacaoRascunho/ModalCriacaoRascunho';

interface ContextoCriaRascunhoProps {
    estilosSessaoMestrada: EstiloSessaoMestradaDto[];
    titulo: string;
    setTitulo: (v: string) => void;
    idEstiloSessaoSelecionado: number;
    setIdEstiloSessaoSelecionado: (v: number) => void;
    podeCriar: boolean;
    handleCriar: () => void;
};

const ContextoCriaRascunho = createContext<ContextoCriaRascunhoProps | undefined>(undefined);

export const useContextoCriaRascunho = (): ContextoCriaRascunhoProps => {
    const context = useContext(ContextoCriaRascunho);
    if (!context) throw new Error('useContextoCriaRascunho precisa estar dentro de um ContextoCriaRascunho');
    return context;
};

export const ContextoCriaRascunhoProvider = ({ estilosSessaoMestrada, isModalOpen, setIsModalOpen }: { estilosSessaoMestrada: EstiloSessaoMestradaDto[]; isModalOpen: boolean; setIsModalOpen: (open: boolean) => void; }) => {
    const [titulo, setTitulo] = useState('');
    const [idEstiloSessaoSelecionado, setIdEstiloSessaoSelecionado] = useState<number>(estilosSessaoMestrada.length === 1 ? estilosSessaoMestrada[0].id : 0);

    const podeCriar: boolean = (titulo !== '' && idEstiloSessaoSelecionado > 0);

    async function handleCriar() {
        // quando Sessão Única, pega o tipo de Sessão Única. Quando Aventura, direto Aventura
        const respostaCriacaoRascunho = await me_salvarRascunho(titulo, idEstiloSessaoSelecionado);

        if (!respostaCriacaoRascunho) {
            alert('Erro ao criar rascunho');
        } else {
            window.location.reload();
        }
    };
    
    return (
        <ContextoCriaRascunho.Provider value={{ estilosSessaoMestrada, titulo, setTitulo, idEstiloSessaoSelecionado, setIdEstiloSessaoSelecionado, podeCriar, handleCriar }}>
            <ModalCriacaoRascunho isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </ContextoCriaRascunho.Provider>
    );
};