'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ArquivoCompletaDto } from 'types-nora-api';

import { obtemTodasImagensEspeciaisArtistaAprovadas } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoListagemSelecaoImagemProps {
    arquivos: ArquivoCompletaDto[];
    idArquivoSelecionado: number | null;
    setIdArquivoSelecionado: (v: number) => void;
    podeSalvar: boolean;
};

const ContextoListagemSelecaoImagem = createContext<ContextoListagemSelecaoImagemProps | undefined>(undefined);

export const useContextoListagemSelecaoImagem = (): ContextoListagemSelecaoImagemProps => {
    const context = useContext(ContextoListagemSelecaoImagem);
    if (!context) throw new Error('useContextoListagemSelecaoImagem precisa estar dentro de um ContextoListagemSelecaoImagem');
    return context;
};

export const ContextoListagemSelecaoImagemProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [arquivos, setArquivos] = useState<ArquivoCompletaDto[]>([]);
    const [idArquivoSelecionado, setIdArquivoSelecionado] = useState<number | null>(null);

    const podeSalvar: boolean = idArquivoSelecionado !== null;

    async function buscaArquivos() {
        setCarregando('Buscando Arquivos');

        try {
            setArquivos(await obtemTodasImagensEspeciaisArtistaAprovadas());
        } catch {
            setArquivos([]);
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaArquivos();
    }, []);

    if (carregando) return <h2>{carregando}</h2>;

    return (
        <ContextoListagemSelecaoImagem.Provider value={{ arquivos, idArquivoSelecionado, setIdArquivoSelecionado, podeSalvar }}>
            {children}
        </ContextoListagemSelecaoImagem.Provider>
    );
};