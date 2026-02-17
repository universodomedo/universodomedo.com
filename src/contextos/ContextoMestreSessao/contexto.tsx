'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SessaoDto } from 'types-nora-api';

import { me_atualizaCapaDeSessaoUnica, obtemSessaoGeral } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import { toast } from 'Hooks/useToast';

interface ContextoPaginaMestreSessaoProps {
    sessaoSelecionada: SessaoDto;
    callbackSelecionaArquivo: (idArquivoSelecionado: number) => void;
};

const ContextoPaginaMestreSessao = createContext<ContextoPaginaMestreSessaoProps | undefined>(undefined);

export const useContextoPaginaMestreSessao = (): ContextoPaginaMestreSessaoProps => {
    const context = useContext(ContextoPaginaMestreSessao);
    if (!context) throw new Error('useContextoPaginaMestreSessao precisa estar dentro de um ContextoPaginaMestreSessao');
    return context;
};

export const ContextoPaginaMestreSessaoProvider = ({ children, idSessao }: { children: React.ReactNode; idSessao: number; }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [sessaoSelecionada, setSessaoSelecionada] = useState<SessaoDto | null>(null);

    async function buscaGrupoAventuraSelecionado(idSessao: number) {
        setCarregando('Buscando Sessão');

        try {
            setSessaoSelecionada(await obtemSessaoGeral(idSessao));
        } catch {
            setSessaoSelecionada(null);
        } finally {
            setCarregando(null);
        }
    };

    const callbackSelecionaArquivo = async (idArquivoSelecionado: number) => {
        if (!sessaoSelecionada) return;
        setCarregando('Atualizando Capa');

        try {
            await me_atualizaCapaDeSessaoUnica(sessaoSelecionada.id, idArquivoSelecionado);
            await toast.sucesso('Capa atualizada!', 'A capa da sessão foi alterada com sucesso.', { recarregaPagina: true });
        } catch (e) {
            await toast.erro('Erro ao atualizar a capa da sessão.', e instanceof Error ? e.message : 'Erro ao atualizar a capa da sessão.');
        } finally {
            setCarregando(null);
        }
    };

    useEffect(() => {
        buscaGrupoAventuraSelecionado(idSessao);
    }, []);

    if (carregando) return <h2>{carregando}</h2>;

    if (!carregando && !sessaoSelecionada) return <p>Sessão não encontrada</p>;

    if (!sessaoSelecionada) return;

    return (
        <ContextoPaginaMestreSessao.Provider value={{ sessaoSelecionada, callbackSelecionaArquivo }}>
            {children}
        </ContextoPaginaMestreSessao.Provider>
    );
};