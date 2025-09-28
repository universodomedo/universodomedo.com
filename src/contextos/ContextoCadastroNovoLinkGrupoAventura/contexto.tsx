'use client';

import { ModalVincularLinkGrupoAventura } from 'Componentes/ElementosModais/ModalVincularLinkGrupoAventura/ModalVincularLinkGrupoAventura';
import { createContext, useContext, useEffect, useState } from 'react';
import { TipoLinkDto } from 'types-nora-api';
import { obtemTodosTiposLink } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoCadastroNovoLinkGrupoAventuraProps {
    iniciaProcessoVinculoLinkGrupoAventura: (paramIdTipoLink: number) => void;
    listaTiposLink: TipoLinkDto[];
    idGrupoAventura: number;
    idTipoLink: number | null;
    descricao: string;
};

const ContextoCadastroNovoLinkGrupoAventura = createContext<ContextoCadastroNovoLinkGrupoAventuraProps | undefined>(undefined);

export const useContextoCadastroNovoLinkGrupoAventura = (): ContextoCadastroNovoLinkGrupoAventuraProps => {
    const context = useContext(ContextoCadastroNovoLinkGrupoAventura);
    if (!context) throw new Error('useContextoCadastroNovoLinkGrupoAventura precisa estar dentro de um ContextoCadastroNovoLinkGrupoAventura');
    return context;
};

export const ContextoCadastroNovoLinkGrupoAventuraProvider = ({ children, idGrupoAventura }: { children: React.ReactNode; idGrupoAventura: number; }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [listaTiposLink, setListaTiposLink] = useState<TipoLinkDto[]>([]);
    const [idTipoLink, setidTipoLink] = useState<number | null>(null);

    const descricao: string = (() => {
        switch (idTipoLink) {
            case 1: return `Trailer do Grupo Aventura ${idGrupoAventura}`;
            case 3: return `Playlist de Episódios do Grupo Aventura ${idGrupoAventura}`;
            case 5: return `Série de Podcasts do Grupo Aventura ${idGrupoAventura}`;
            default: return '';
        }
    })();

    async function buscaTiposLink() {
        setListaTiposLink(await obtemTodosTiposLink());
    }

    const iniciaProcessoVinculoLinkGrupoAventura = (paramIdTipoLink: number) => {
        setidTipoLink(paramIdTipoLink);
        setIsModalOpen(true);
    }

    useEffect(() => {
        buscaTiposLink();
    }, []);

    return (
        <ContextoCadastroNovoLinkGrupoAventura.Provider value={{ iniciaProcessoVinculoLinkGrupoAventura, listaTiposLink, idGrupoAventura, idTipoLink, descricao }}>
            {children}
            <ModalVincularLinkGrupoAventura isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </ContextoCadastroNovoLinkGrupoAventura.Provider>
    );
};