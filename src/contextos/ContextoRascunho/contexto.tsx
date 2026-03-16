'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DetalheRascunhoAventuraCompletaDto, DetalheRascunhoSessaoUnicaCanonicaCompletaDto, DetalheRascunhoSessaoUnicaNaoCanonicaCompletaDto, RascunhoCompletaDto } from 'types-nora-api';

import { me_obtemDetalhesRascunho, editaDetalheRascunho, criaBaseadoEmRascunho } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import EdicaoRascunho from 'Componentes/EdicaoRascunho/page';

interface ContextoRascunhoProps {
    alteraEstadoModalEdicao: (aberto: boolean) => void;
    rascunho: RascunhoCompletaDto | null;
    salvaDetalhesRascunhoAventura: (detalheRascunhoAventura: DetalheRascunhoAventuraCompletaDto) => void;
    salvaDetalhesRascunhoSessaoUnicaCanonica: (detalheRascunhoSessaoUnicaCanonica: DetalheRascunhoSessaoUnicaCanonicaCompletaDto) => void;
    salvaDetalhesRascunhoSessaoUnica: (detalheRascunhoSessaoUnicaNaoCanonica: DetalheRascunhoSessaoUnicaNaoCanonicaCompletaDto) => void;
    textoBotaoCriar: string;
    executaCriacao: () => void;
};

const ContextoRascunho = createContext<ContextoRascunhoProps | undefined>(undefined);

export const useContextoRascunho = (): ContextoRascunhoProps => {
    const context = useContext(ContextoRascunho);
    if (!context) throw new Error('useContextoRascunho precisa estar dentro de um ContextoRascunho');
    return context;
};

export const ContextoRascunhoProvider = ({ children, idRascunhoSelecionado }: { children: React.ReactNode; idRascunhoSelecionado: number }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [carregando, setCarregando] = useState<string | null>(null);
    const [rascunho, setRascunho] = useState<RascunhoCompletaDto | null>(null);

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

    const textoBotaoCriar: string = rascunho == null ? '' : rascunho.estiloSessaoMestrada.id === 1 ? 'Criar Aventura' : 'Criar Sessão';

    const salvaDetalhesRascunhoAventura = async (detalheRascunhoAventura: DetalheRascunhoAventuraCompletaDto) => {
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

    const salvaDetalhesRascunhoSessaoUnicaCanonica = async (detalheRascunhoSessaoUnicaCanonica: DetalheRascunhoSessaoUnicaCanonicaCompletaDto) => {
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

    const salvaDetalhesRascunhoSessaoUnica = async (detalheRascunhoSessaoUnicaNaoCanonica: DetalheRascunhoSessaoUnicaNaoCanonicaCompletaDto) => {
        try {
            if (!await editaDetalheRascunho({
                ...rascunho!,
                detalheRascunhoSessaoUnicaNaoCanonica: detalheRascunhoSessaoUnicaNaoCanonica,
            })) throw new Error("Erro ao salvar o Rascunho");

            buscaDetalhesRascunho();
            alteraEstadoModalEdicao(false);
        } catch {
            alert(`Erro ao salvar o Rascunho`);
        }
    }

    const executaCriacao = async() => {
        if (!rascunho) return;

        const respostaCriacaoRascunho = await criaBaseadoEmRascunho(rascunho.id);

        if (!respostaCriacaoRascunho) {
            alert('Erro ao criar rascunho');
        } else {
            window.location.reload();
        }
    };

    useEffect(() => {
        buscaDetalhesRascunho();
    }, []);

    if (carregando) return <h2>{carregando}</h2>;

    return (
        <ContextoRascunho.Provider value={{ textoBotaoCriar, alteraEstadoModalEdicao, rascunho, salvaDetalhesRascunhoAventura, salvaDetalhesRascunhoSessaoUnicaCanonica, salvaDetalhesRascunhoSessaoUnica, executaCriacao}}>
            {children}
            <EdicaoRascunho isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </ContextoRascunho.Provider>
    );
};