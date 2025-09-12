'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { PersonagemDto } from 'types-nora-api';
import { obtemPersonagensComPendencias } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import { ModalCriacaoFicha } from './componentes';

interface ContextoPaginaFichasPendentesProps {
    listaPersonagensComPendencia: PersonagemDto[] | null;
    abreModalConfiguraFicha: (idPersonagem: number) => void;
    personagemConfigurando: PersonagemDto | null;
};

const ContextoPaginaFichasPendentes = createContext<ContextoPaginaFichasPendentesProps | undefined>(undefined);

export const useContextoPaginaFichasPendentes = (): ContextoPaginaFichasPendentesProps => {
    const context = useContext(ContextoPaginaFichasPendentes);
    if (!context) throw new Error('useContextoPaginaFichasPendentes precisa estar dentro de um ContextoPaginaFichasPendentes');
    return context;
};

export const ContextoPaginaFichasPendentesProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState(true);
    const [listaPersonagensComPendencia, setListaPersonagensComPendencia] = useState<PersonagemDto[] | null>(null);
    const [personagemConfigurando, setPersonagemConfigurando] = useState<PersonagemDto | null>(null);

    const [modalConfiguraFichaEstaAberta, setModalConfiguraFichaEstaAberta] = useState(false);
    const abreModalConfiguraFicha = (idPersonagem: number) => {
        setPersonagemConfigurando(listaPersonagensComPendencia?.find(personagem => personagem.id === idPersonagem)!);
        setModalConfiguraFichaEstaAberta(true);
    }

    async function buscaPersonagensComEvolucaoPendente() {
        setCarregando(true);

        try {
            setListaPersonagensComPendencia(await obtemPersonagensComPendencias());
        } catch {
            setListaPersonagensComPendencia(null);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscaPersonagensComEvolucaoPendente();
    }, []);

    if (carregando) return <div>Carregando personagens com pendencias...</div>;

    if (!listaPersonagensComPendencia) return <div>Não há personagens com pendências</div>

    return (
        <ContextoPaginaFichasPendentes.Provider value={{ listaPersonagensComPendencia, abreModalConfiguraFicha, personagemConfigurando }}>
            {children}
            <ModalCriacaoFicha modalEstaAberta={modalConfiguraFichaEstaAberta} onOpenChange={setModalConfiguraFichaEstaAberta} />
        </ContextoPaginaFichasPendentes.Provider>
    );
};