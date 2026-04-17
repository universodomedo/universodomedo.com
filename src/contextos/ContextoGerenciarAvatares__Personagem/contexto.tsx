'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto } from 'types-nora-api';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SPA__PaginaGerenciarAvatares__Personagem from 'Conteineres/GerenciarAvatares/paginas/SPA__PaginaGerenciarAvatares__Personagem/SPA__PaginaGerenciarAvatares__Personagem';
import ModalUploadEVerificacaoAvatar from '@/componentes/ElementosModais/ModalUploadEVerificacaoAvatar/ModalUploadEVerificacaoAvatar';

interface ContextoGerenciarAvatares__Personagem__Props {
    personagem: VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto;
    avataresDeComparacao: string[];
    abreModalUploadEVerificacaoAvatar: () => void;
};

const ContextoGerenciarAvatares__Personagem = createContext<ContextoGerenciarAvatares__Personagem__Props | undefined>(undefined);

export const useContextoGerenciarAvatares__Personagem = (): ContextoGerenciarAvatares__Personagem__Props => {
    const context = useContext(ContextoGerenciarAvatares__Personagem);
    if (!context) throw new Error('useContextoGerenciarAvatares__Personagem precisa estar dentro de um ContextoGerenciarAvatares__Personagem');
    return context;
};

export const ContextoGerenciarAvatares__Personagem__Provider = ({ personagem, avataresDeComparacao, deselecionaPersonagem }: { personagem: VIEW_LISTAGEM_GerenciamentoAvataresPersonagemDto; avataresDeComparacao: string[]; deselecionaPersonagem: () => void; }) => {
    useConfigurarLayoutContextualizado({ titulo: personagem.nome, fecharProps: { tipo: 'acao', executar: deselecionaPersonagem, tituloTooltip: 'Voltar para Lista de Personagens' } }, 'patch');

    const [modalOpen, setModalOpen] = useState(false);

    const abreModalUploadEVerificacaoAvatar = () => { setModalOpen(true); }

    return (
        <ContextoGerenciarAvatares__Personagem.Provider value={{ personagem, avataresDeComparacao, abreModalUploadEVerificacaoAvatar }}>
            <SPA__PaginaGerenciarAvatares__Personagem />
            <ModalUploadEVerificacaoAvatar modalEstaAberta={modalOpen} onOpenChange={setModalOpen} />
        </ContextoGerenciarAvatares__Personagem.Provider>
    );
};