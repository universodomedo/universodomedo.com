'use client';

import { createContext, useContext, useState } from 'react';
import { PAYLOAD_DetalheRascunhoEdicaoDto, RascunhoCompletaDto } from 'types-nora-api';

import { editaDetalheRascunho } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import DetalhesRascunho_Conteudo from 'Componentes/Elementos/DetalhesRascunho/componentes';
import EdicaoRascunho from 'Componentes/EdicaoRascunho/EdicaoRascunho';
import { toast } from 'Hooks/useToast';

interface ContextoRascunhoProps {
    alteraEstadoModalEdicao: (aberto: boolean) => void;
    rascunho: RascunhoCompletaDto;
    salvaDetalhesRascunho: (detalheRascunho: PAYLOAD_DetalheRascunhoEdicaoDto) => Promise<void>;
};

const ContextoRascunho = createContext<ContextoRascunhoProps | undefined>(undefined);

export const useContextoRascunho = (): ContextoRascunhoProps => {
    const context = useContext(ContextoRascunho);
    if (!context) throw new Error('useContextoRascunho precisa estar dentro de um ContextoRascunho');
    return context;
};

export const ContextoRascunhoProvider = ({ rascunho }: { rascunho: RascunhoCompletaDto; }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const alteraEstadoModalEdicao = (aberto: boolean) => { setIsModalOpen(aberto); };

    const salvaDetalhesRascunho = async (detalheRascunho: PAYLOAD_DetalheRascunhoEdicaoDto): Promise<void> => {
        try {
            await editaDetalheRascunho(detalheRascunho);
            await toast.sucesso('Rascunho alterado com sucesso!', `Rascunho ${rascunho.titulo} foi editado`, { recarregaPagina: true });
        } catch (e) {
            await toast.erro('Falha ao alterar Rascunho', e instanceof Error ? e.message : 'Falha ao salvar Rascunho');
        }
    };

    return (
        <ContextoRascunho.Provider value={{ alteraEstadoModalEdicao, rascunho, salvaDetalhesRascunho }}>
            <>
                <DetalhesRascunho_Conteudo />
                <EdicaoRascunho isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </>
        </ContextoRascunho.Provider>
    );
};