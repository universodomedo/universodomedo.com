'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DetalheRascunhoAventuraDto, DetalheRascunhoSessaoUnicaCanonicaDto, DetalheRascunhoSessaoUnicaDto, RascunhoDto } from 'types-nora-api';

import { me_obtemDetalhesRascunho, editaDetalheRascunho } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import EdicaoRascunho from 'Componentes/EdicaoRascunho/page';

interface ContextoRascunhoProps {
    alteraEstadoModalEdicao: (aberto: boolean) => void;
    rascunho: RascunhoDto;
    salvaDetalhesRascunhoAventura: (detalheRascunhoAventura: DetalheRascunhoAventuraDto) => void;
    salvaDetalhesRascunhoSessaoUnicaCanonica: (detalheRascunhoSessaoUnicaCanonica: DetalheRascunhoSessaoUnicaCanonicaDto) => void;
    salvaDetalhesRascunhoSessaoUnica: (detalheRascunhoSessaoUnica: DetalheRascunhoSessaoUnicaDto) => void;
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
            setRascunho(await me_obtemDetalhesRascunho(idRascunhoSelecionado));
        } catch {
            setRascunho(null);
        } finally {
            setCarregando(null);
        }
    }

    const alteraEstadoModalEdicao = (aberto: boolean) => {
        setIsModalOpen(aberto);
    }

    const salvaDetalhesRascunhoAventura = async (detalheRascunhoAventura: DetalheRascunhoAventuraDto) => {
        try {
            if (!await editaDetalheRascunho({
                ...rascunho!,
                detalheRascunhoAventura: detalheRascunhoAventura,
            })) throw new Error("Erro ao salvar o Rascunho");

            buscaDetalhesRascunho();
            alteraEstadoModalEdicao(false);
        } catch {
            alert(`Erro ao salvar o Rascunho`);
        }
    }

    const salvaDetalhesRascunhoSessaoUnicaCanonica = async (detalheRascunhoSessaoUnicaCanonica: DetalheRascunhoSessaoUnicaCanonicaDto) => {
        try {
            if (!await editaDetalheRascunho({
                ...rascunho!,
                detalheRascunhoSessaoUnicaCanonica: detalheRascunhoSessaoUnicaCanonica,
            })) throw new Error("Erro ao salvar o Rascunho");

            buscaDetalhesRascunho();
            alteraEstadoModalEdicao(false);
        } catch {
            alert(`Erro ao salvar o Rascunho`);
        }
    }

    const salvaDetalhesRascunhoSessaoUnica = async (detalheRascunhoSessaoUnica: DetalheRascunhoSessaoUnicaDto) => {
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
        <ContextoRascunho.Provider value={{ alteraEstadoModalEdicao, rascunho, salvaDetalhesRascunhoAventura, salvaDetalhesRascunhoSessaoUnicaCanonica, salvaDetalhesRascunhoSessaoUnica }}>
            {children}
            <EdicaoRascunho isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </ContextoRascunho.Provider>
    );
};