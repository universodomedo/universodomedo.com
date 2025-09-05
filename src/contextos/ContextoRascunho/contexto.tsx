'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DetalheRascunhoSessaoUnicaDto, RascunhoDto } from 'types-nora-api';

import { editaDetalheRascunho, obtemDetalhesRascunho } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { ContextoEdicaoRascunhoSessaoUnicaNaoCanonicaProvider } from 'Contextos/ContextoEdicaoRascunhoSessaoUnicaNaoCanonica/contexto';
import { ModalEditarRascunho } from 'Componentes/ElementosModais/ModalEditarRascunho/ModalEditarRascunho';

interface ContextoRascunhoProps {
    alteraEstadoModalEdicao: (aberto: boolean) => void;
    rascunho: RascunhoDto;
    salvaDetalhesRascunho: (detalheRascunhoSessaoUnica: DetalheRascunhoSessaoUnicaDto) => void;
};

const ContextoRascunho = createContext<ContextoRascunhoProps | undefined>(undefined);

export const useContextoRascunho = (): ContextoRascunhoProps => {
    const context = useContext(ContextoRascunho);
    if (!context) throw new Error('useContextoRascunho precisa estar dentro de um ContextoRascunho');
    return context;
};

export const ContextoRascunhoProvider = ({ children, idRascunhoSelecionado }: { children: React.ReactNode; idRascunhoSelecionado: number }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [carregando, setCarregando] = useState<string | null>('');
    const [rascunho, setRascunho] = useState<RascunhoDto | null>(null);

    async function buscaDetalhesRascunho() {
        setCarregando('Buscando Rascunho');

        try {
            setRascunho(await obtemDetalhesRascunho(idRascunhoSelecionado));
        } catch {
            setRascunho(null);
        } finally {
            setCarregando(null);
        }
    }

    const alteraEstadoModalEdicao = (aberto: boolean) => {
        setIsModalOpen(aberto);
    }

    const salvaDetalhesRascunho = async (detalheRascunhoSessaoUnica: DetalheRascunhoSessaoUnicaDto) => {
        try {
            if (!await editaDetalheRascunho({
                ...rascunho!,
                detalheRascunhoSessaoUnica: detalheRascunhoSessaoUnica,
            })) throw new Error("Erro ao salvar o Rascunho");

            buscaDetalhesRascunho();
            alteraEstadoModalEdicao(false);
        } catch {
            alert(`Erro ao salvar o Rascunho`);
        }
    }

    useEffect(() => {
        buscaDetalhesRascunho();
    }, []);

    if (carregando) return <h2>{carregando}</h2>

    if (!carregando && !rascunho) return <p>Rascunho não encontrado</p>;

    if (!rascunho) return;

    return (
        <ContextoRascunho.Provider value={{ alteraEstadoModalEdicao, rascunho, salvaDetalhesRascunho }}>
            {children}
            <ContextoEdicaoRascunhoSessaoUnicaNaoCanonicaProvider>
                <ModalEditarRascunho isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </ContextoEdicaoRascunhoSessaoUnicaNaoCanonicaProvider>
        </ContextoRascunho.Provider>
    );
};