'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { BotaoConfigurarArteCapa } from 'Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/CabecalhoDeAventura/CabecalhoDeAventura';
import Modal__ConfiguradorArteCapa from 'Componentes/ElementosModais/Modal__ConfiguradorArteCapa/Modal__ConfiguradorArteCapa';

interface Contexto__Modal__ConfiguradorArteCapa__Props {
    callbackConfigArteCapa: () => void;
};

const Contexto__Modal__ConfiguradorArteCapa = createContext<Contexto__Modal__ConfiguradorArteCapa__Props | undefined>(undefined);

export const useContexto__Modal__ConfiguradorArteCapa = (): Contexto__Modal__ConfiguradorArteCapa__Props => {
    const context = useContext(Contexto__Modal__ConfiguradorArteCapa);
    if (!context) throw new Error('useContexto__Modal__ConfiguradorArteCapa precisa estar dentro de um Contexto__Modal__ConfiguradorArteCapa');
    return context;
};

export function Recipiente__Contexto__Modal__ConfiguradorArteCapa__Provider({ callbackConfigArteCapa }: { callbackConfigArteCapa: () => void; }) {
    return <Contexto__Modal__ConfiguradorArteCapa__Provider callbackConfigArteCapa={callbackConfigArteCapa} />
};

const Contexto__Modal__ConfiguradorArteCapa__Provider = ({ callbackConfigArteCapa }: { callbackConfigArteCapa: () => void; }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);

    return (
        <Contexto__Modal__ConfiguradorArteCapa.Provider value={{ callbackConfigArteCapa }}>
            <BotaoConfigurarArteCapa openModalConfigurarArteCapa={openModal} />
            <Modal__ConfiguradorArteCapa isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </Contexto__Modal__ConfiguradorArteCapa.Provider>
    );
};