'use client';

import { ChangeEvent, createContext, useContext, useEffect, useState } from 'react';

import { toast } from 'Hooks/useToast';
import { deleteArquivo_PorPath_SUDO } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaSUDODeletarArquivosAbsolutoProps {
    caminhoArquivo: string;
    onChangeCaminhoArquivo: (e: ChangeEvent<HTMLInputElement>) => void;
    podeExecutarDelete: boolean;
    executaDelete: () => void;
};

const ContextoPaginaSUDODeletarArquivosAbsoluto = createContext<ContextoPaginaSUDODeletarArquivosAbsolutoProps | undefined>(undefined);

export const useContextoPaginaSUDODeletarArquivosAbsoluto = (): ContextoPaginaSUDODeletarArquivosAbsolutoProps => {
    const context = useContext(ContextoPaginaSUDODeletarArquivosAbsoluto);
    if (!context) throw new Error('useContextoPaginaSUDODeletarArquivosAbsoluto precisa estar dentro de um ContextoPaginaSUDODeletarArquivosAbsoluto');
    return context;
};

export const ContextoPaginaSUDODeletarArquivosAbsolutoProvider = ({ children }: { children: React.ReactNode }) => {
    const [caminhoArquivo, setCaminhoAbsoluto] = useState<string>('');

    const podeExecutarDelete = caminhoArquivo.trim() !== '';

    const onChangeCaminhoArquivo = (e: ChangeEvent<HTMLInputElement>) => setCaminhoAbsoluto(e.target.value);

    async function executaDelete() {
        if (!podeExecutarDelete) return;

        const confirmou = window.confirm(`Deseja realmente deletar o arquivo [${caminhoArquivo}]?`);

        if (!confirmou) return;

        try {
            await deleteArquivo_PorPath_SUDO(caminhoArquivo);
            await toast.sucesso('Arquivo deletado', `Arquivo ${caminhoArquivo} foi deletado com sucesso.`, { recarregaPagina: true });
        } catch (e) { await toast.erro('Falha ao deletar arquivo', e instanceof Error ? e.message : 'Falha ao deletar arquivo'); }
    };

    return (
        <ContextoPaginaSUDODeletarArquivosAbsoluto.Provider value={{ caminhoArquivo, onChangeCaminhoArquivo, podeExecutarDelete, executaDelete }}>
            {children}
        </ContextoPaginaSUDODeletarArquivosAbsoluto.Provider>
    );
};