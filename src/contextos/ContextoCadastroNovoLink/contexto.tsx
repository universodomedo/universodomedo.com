'use client';

import { ModalVincularLink } from 'Componentes/ElementosModais/ModalVincularLink/ModalVincularLink';
import { createContext, useContext, useEffect, useState } from 'react';
import { SessaoDto, TipoLinkDto } from 'types-nora-api';
import { obtemTodosTiposLink } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoCadastroNovoLinkProps {
    iniciaProcessoVinculoLink: (paramIdTipoLink: number, paramEhTrailer: boolean) => void;
    listaTiposLink: TipoLinkDto[];
    sessao: SessaoDto;
    idTipoLink: number | null;
    descricao: string;
};

const ContextoCadastroNovoLink = createContext<ContextoCadastroNovoLinkProps | undefined>(undefined);

export const useContextoCadastroNovoLink = (): ContextoCadastroNovoLinkProps => {
    const context = useContext(ContextoCadastroNovoLink);
    if (!context) throw new Error('useContextoCadastroNovoLink precisa estar dentro de um ContextoCadastroNovoLink');
    return context;
};

export const ContextoCadastroNovoLinkProvider = ({ children, sessao, idGrupoAventura }: { children: React.ReactNode; sessao: SessaoDto; idGrupoAventura: number; }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [listaTiposLink, setListaTiposLink] = useState<TipoLinkDto[]>([]);
    const [idTipoLink, setidTipoLink] = useState<number | null>(null);
    const [ehTrailer, setEhTrailer] = useState<boolean | null>(null);

    const descricao: string = (() => {
        if (ehTrailer === null) return '';

        switch (idTipoLink) {
            case 1: return ehTrailer ? `Trailer do Grupo Aventura ${idGrupoAventura}` : `Video do Episódio ${sessao.episodio} do Grupo Aventura ${idGrupoAventura}`;
            case 2: return `Playlist de Episódios do Grupo Aventura ${idGrupoAventura}`;
            case 3: return `Podcast do Episódio ${sessao.episodio} do Grupo Aventura ${idGrupoAventura}`;
            case 4: return `Série de Podcasts do Grupo Aventura ${idGrupoAventura}`;
            default: return '';
        }
    })();

    async function buscaTiposLink() {
        setListaTiposLink(await obtemTodosTiposLink());
    }

    const iniciaProcessoVinculoLink = (paramIdTipoLink: number, paramEhTrailer: boolean) => {
        setidTipoLink(paramIdTipoLink);
        setEhTrailer(paramEhTrailer);
        setIsModalOpen(true);
    }

    useEffect(() => {
        buscaTiposLink();
    }, []);

    return (
        <ContextoCadastroNovoLink.Provider value={{ iniciaProcessoVinculoLink, listaTiposLink, sessao, idTipoLink, descricao }}>
            {children}
            <ModalVincularLink isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </ContextoCadastroNovoLink.Provider>
    );
};