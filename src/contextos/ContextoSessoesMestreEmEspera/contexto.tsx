'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SessaoDto } from 'types-nora-api';

import ModalIniciarSessaoMestre from 'Componentes/ElementosModais/ModalIniciarSessaoMestre/ModalIniciarSessaoMestre';
import { me_obtemMinhasSessoesEmEsperaParaMestrar } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoSessoesMestreEmEsperaProps {
    sessoesEmEspera: SessaoDto[];
    sessaoSelecionada: SessaoDto | null;
    selecionaSessao: (idSessao: number) => void;
    deselecionaSessao: () => void;
};

const ContextoSessoesMestreEmEspera = createContext<ContextoSessoesMestreEmEsperaProps | undefined>(undefined);

export const useContextoSessoesMestreEmEspera = (): ContextoSessoesMestreEmEsperaProps => {
    const context = useContext(ContextoSessoesMestreEmEspera);
    if (!context) throw new Error('useContextoSessoesMestreEmEspera precisa estar dentro de um ContextoSessoesMestreEmEspera');
    return context;
};

export const ContextoSessoesMestreEmEsperaProvider = ({ children }: { children: React.ReactNode }) => {
    const [carregando, setCarregando] = useState<string | null>(null);
    const [sessoesEmEspera, setSessoesEmEspera] = useState<SessaoDto[]>([]);
    const [sessaoSelecionada, setSessaoSelecionada] = useState<SessaoDto | null>(null);

    async function buscaSessoesEmEsperaDesseMestre() {
        setCarregando('Buscando Sessão');

        try {
            setSessoesEmEspera(await me_obtemMinhasSessoesEmEsperaParaMestrar());
        } catch {
            setSessoesEmEspera([]);
        } finally {
            setCarregando(null);
        }
    };

    function selecionaSessao(idSessao: number) { setSessaoSelecionada(sessoesEmEspera.find(sessaoEmEspera => sessaoEmEspera.id === idSessao)!); };
    function deselecionaSessao() { setSessaoSelecionada(null); };

    useEffect(() => {
        buscaSessoesEmEsperaDesseMestre();
    }, []);

    if (carregando) return <div>{carregando}</div>;

    return (
        <ContextoSessoesMestreEmEspera.Provider value={{ sessoesEmEspera, sessaoSelecionada, selecionaSessao, deselecionaSessao }}>
            {children}
            <ModalIniciarSessaoMestre isModalOpen={!!sessaoSelecionada} setIsModalOpen={deselecionaSessao} />
        </ContextoSessoesMestreEmEspera.Provider>
    );
};