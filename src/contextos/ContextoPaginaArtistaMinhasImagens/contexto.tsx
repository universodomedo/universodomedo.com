'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ArquivoDto } from 'types-nora-api';
import { me_obtemTodosArquivosAprovados } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaArtistaMinhasImagensProps {
    arquivos: ArquivoDto[];
};

const ContextoPaginaArtistaMinhasImagens = createContext<ContextoPaginaArtistaMinhasImagensProps | undefined>(undefined);

export const useContextoPaginaArtistaMinhasImagens = (): ContextoPaginaArtistaMinhasImagensProps => {
    const context = useContext(ContextoPaginaArtistaMinhasImagens);
    if (!context) throw new Error('useContextoPaginaArtistaMinhasImagens precisa estar dentro de um ContextoPaginaArtistaMinhasImagens');
    return context;
};

export const ContextoPaginaArtistaMinhasImagensProvider = ({ children }: { children: React.ReactNode }) => {
     console.log('?2');
    const [carregando, setCarregando] = useState<string | null>(null);
    const [arquivos, setArquivos] = useState<ArquivoDto[]>([]);

    async function buscaMeusArquivos() {
        setCarregando('Buscando Arquivos');

        try {
            setArquivos(await me_obtemTodosArquivosAprovados());
        } catch {
            setArquivos([]);
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaMeusArquivos();
    }, []);

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoPaginaArtistaMinhasImagens.Provider value={{ arquivos }}>
            {children}
        </ContextoPaginaArtistaMinhasImagens.Provider>
    );
};