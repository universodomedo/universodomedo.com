'use client';

import { mapSessaoDadosGerais, SessaoDadosGerais } from 'Adaptadores/SessaoDadosGerais';
import { createContext, useContext, useEffect, useState } from 'react';
import { SessaoDto, UsuarioDto } from 'types-nora-api';
import { obtemSessaoGeral } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoPaginaMestreSessaoProps {
    sessaoSelecionada: SessaoDto;
    sessaoDadosGeraisSelecionado: SessaoDadosGerais | null;
};

const ContextoPaginaMestreSessao = createContext<ContextoPaginaMestreSessaoProps | undefined>(undefined);

export const useContextoPaginaMestreSessao = (): ContextoPaginaMestreSessaoProps => {
    const context = useContext(ContextoPaginaMestreSessao);
    if (!context) throw new Error('useContextoPaginaMestreSessao precisa estar dentro de um ContextoPaginaMestreSessao');
    return context;
};

export const ContextoPaginaMestreSessaoProvider = ({ children, idSessao }: { children: React.ReactNode; idSessao: number; }) => {
    const [carregando, setCarregando] = useState<string | null>('');
    const [sessaoSelecionada, setSessaoSelecionada] = useState<SessaoDto | null>(null);

    const sessaoDadosGeraisSelecionado: SessaoDadosGerais | null = sessaoSelecionada ? mapSessaoDadosGerais(sessaoSelecionada) : null;

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

    useEffect(() => {
        buscaGrupoAventuraSelecionado(idSessao);
    }, []);

    if (carregando) return <h2>{carregando}</h2>

    if (!carregando && !sessaoSelecionada) return <p>Sessão não encontrada</p>;

    if (!sessaoSelecionada) return;
    
    return (
        <ContextoPaginaMestreSessao.Provider value={{ sessaoSelecionada, sessaoDadosGeraisSelecionado }}>
            {children}
        </ContextoPaginaMestreSessao.Provider>
    );
};