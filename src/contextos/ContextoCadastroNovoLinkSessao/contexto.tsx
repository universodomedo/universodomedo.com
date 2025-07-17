'use client';

import { ModalVincularLinkSessao } from 'Componentes/ElementosModais/ModalVincularLinkSessao/ModalVincularLinkSessao';
import { createContext, useContext, useEffect, useState } from 'react';
import { SessaoDto, TipoLinkDto } from 'types-nora-api';
import { obtemTodosTiposLink } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoCadastroNovoLinkSessaoProps {
    iniciaProcessoVinculoLinkSessao: (paramIdTipoLink: number) => void;
    listaTiposLink: TipoLinkDto[];
    sessao: SessaoDto;
    idTipoLink: number | null;
    descricao: string;
};

const ContextoCadastroNovoLinkSessao = createContext<ContextoCadastroNovoLinkSessaoProps | undefined>(undefined);

export const useContextoCadastroNovoLinkSessao = (): ContextoCadastroNovoLinkSessaoProps => {
    const context = useContext(ContextoCadastroNovoLinkSessao);
    if (!context) throw new Error('useContextoCadastroNovoLinkSessao precisa estar dentro de um ContextoCadastroNovoLinkSessao');
    return context;
};

export const ContextoCadastroNovoLinkSessaoProvider = ({ children, sessao, idGrupoAventura }: { children: React.ReactNode; sessao: SessaoDto; idGrupoAventura: number; }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [listaTiposLink, setListaTiposLink] = useState<TipoLinkDto[]>([]);
    const [idTipoLink, setidTipoLink] = useState<number | null>(null);

    const descricao: string = (() => {
        switch (idTipoLink) {
            case 2: return `Video do Episódio ${sessao.episodio} do Grupo Aventura ${idGrupoAventura}`;
            case 4: return `Podcast do Episódio ${sessao.episodio} do Grupo Aventura ${idGrupoAventura}`;
            default: return '';
        }
    })();

    async function buscaTiposLink() {
        setListaTiposLink(await obtemTodosTiposLink());
    }

    const iniciaProcessoVinculoLinkSessao = (paramIdTipoLink: number) => {
        setidTipoLink(paramIdTipoLink);
        setIsModalOpen(true);
    }

    useEffect(() => {
        buscaTiposLink();
    }, []);

    return (
        <ContextoCadastroNovoLinkSessao.Provider value={{ iniciaProcessoVinculoLinkSessao, listaTiposLink, sessao, idTipoLink, descricao }}>
            {children}
            <ModalVincularLinkSessao isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </ContextoCadastroNovoLinkSessao.Provider>
    );
};