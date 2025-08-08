'use client';

import { ModalVincularLinkSessao } from 'Componentes/ElementosModais/ModalVincularLinkSessao/ModalVincularLinkSessao';
import { createContext, useContext, useEffect, useState } from 'react';
import { DetalheSessaoCanonicaDto, TipoLinkDto } from 'types-nora-api';
import { obtemTodosTiposLink } from 'Uteis/ApiConsumer/ConsumerMiddleware';

interface ContextoCadastroNovoLinkSessaoProps {
    iniciaProcessoVinculoLinkSessao: (paramIdTipoLink: number) => void;
    listaTiposLink: TipoLinkDto[];
    detalheSessao: DetalheSessaoCanonicaDto;
    idTipoLink: number | null;
    descricao: string;
};

const ContextoCadastroNovoLinkSessao = createContext<ContextoCadastroNovoLinkSessaoProps | undefined>(undefined);

export const useContextoCadastroNovoLinkSessao = (): ContextoCadastroNovoLinkSessaoProps => {
    const context = useContext(ContextoCadastroNovoLinkSessao);
    if (!context) throw new Error('useContextoCadastroNovoLinkSessao precisa estar dentro de um ContextoCadastroNovoLinkSessao');
    return context;
};

export const ContextoCadastroNovoLinkSessaoProvider = ({ children, detalheSessao, idGrupoAventura }: { children: React.ReactNode; detalheSessao: DetalheSessaoCanonicaDto; idGrupoAventura: number; }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [listaTiposLink, setListaTiposLink] = useState<TipoLinkDto[]>([]);
    const [idTipoLink, setidTipoLink] = useState<number | null>(null);

    const descricao: string = (() => {
        switch (idTipoLink) {
            case 2: return `Video do Episódio ${detalheSessao.episodio} do Grupo Aventura ${idGrupoAventura}`;
            case 4: return `Podcast do Episódio ${detalheSessao.episodio} do Grupo Aventura ${idGrupoAventura}`;
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
        <ContextoCadastroNovoLinkSessao.Provider value={{ iniciaProcessoVinculoLinkSessao, listaTiposLink, detalheSessao, idTipoLink, descricao }}>
            {children}
            <ModalVincularLinkSessao isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </ContextoCadastroNovoLinkSessao.Provider>
    );
};