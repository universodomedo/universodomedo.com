'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ArquivoDto } from 'types-nora-api';

import { toast } from 'Hooks/useToast';
import { buscaTodosArquivos_SUDO, deleteArquivo_SUDO } from 'Uteis/ApiConsumer/ConsumerMiddleware';


interface ContextoPaginaSUDODeletarArquivosProps {
    arquivos: ArquivoDto[];
    enviaDelete: (arquivo: ArquivoDto) => void;
};

const ContextoPaginaSUDODeletarArquivos = createContext<ContextoPaginaSUDODeletarArquivosProps | undefined>(undefined);

export const useContextoPaginaSUDODeletarArquivos = (): ContextoPaginaSUDODeletarArquivosProps => {
    const context = useContext(ContextoPaginaSUDODeletarArquivos);
    if (!context) throw new Error('useContextoPaginaSUDODeletarArquivos precisa estar dentro de um ContextoPaginaSUDODeletarArquivos');
    return context;
};

export const ContextoPaginaSUDODeletarArquivosProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>('');
    const [arquivos, setArquivos] = useState<ArquivoDto[]>([]);

    async function obtemTodosArquivos_SUDO() {
        setCarregando('Buscando Arquivos');

        try {
            setArquivos(await buscaTodosArquivos_SUDO());
        } catch {
            setArquivos([]);
        } finally {
            setCarregando(null);
        }
    };

    async function enviaDelete(arquivo: ArquivoDto) {
        const confirmou = window.confirm(`Deseja realmente deletar o arquivo ${arquivo.detalheArquivoInterno?.nomeInterno ? `${arquivo.detalheArquivoInterno.nomeInterno}` : `ID [#${arquivo.id}]`}?`);

        if (!confirmou) return;

        try {
            await deleteArquivo_SUDO(arquivo);
            await toast.sucesso('Arquivo deletado', `Arquivo ${arquivo.detalheArquivoInterno ? arquivo.detalheArquivoInterno.nomeInterno : ''} foi deletado com sucesso.`, { recarregaPagina: true });
        } catch (e) { await toast.erro('Falha ao deletar arquivo', e instanceof Error ? e.message : 'Falha ao deletar arquivo'); }
    };

    useEffect(() => {
        obtemTodosArquivos_SUDO();
    }, []);

    if (carregando) return <h2>{carregando}</h2>;

    return (
        <ContextoPaginaSUDODeletarArquivos.Provider value={{ arquivos, enviaDelete }}>
            {children}
        </ContextoPaginaSUDODeletarArquivos.Provider>
    );
};