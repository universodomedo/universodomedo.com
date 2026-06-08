'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaAdminTutoriais__Props } from '../Contexto__PaginaAdminTutoriais/contexto';
import SPA__PaginaAdminTutoriais__Editor from 'Conteineres/PaginaAdminTutoriais/paginas/SPA__PaginaAdminTutoriais__Editor/SPA__PaginaAdminTutoriais__Editor';

interface Contexto__PaginaAdminTutoriais__Editor__Props {
    tutorialEmEdicaoId: Contexto__PaginaAdminTutoriais__Props['tutorialEmEdicaoId'];
    voltarParaListagem: Contexto__PaginaAdminTutoriais__Props['voltarParaListagem'];
};

const Contexto__PaginaAdminTutoriais__Editor = createContext<Contexto__PaginaAdminTutoriais__Editor__Props | undefined>(undefined);

export const useContexto__PaginaAdminTutoriais__Editor = (): Contexto__PaginaAdminTutoriais__Editor__Props => {
    const context = useContext(Contexto__PaginaAdminTutoriais__Editor);
    if (!context) throw new Error('useContexto__PaginaAdminTutoriais__Editor precisa estar dentro de um Contexto__PaginaAdminTutoriais__Editor');
    return context;
};

export const Contexto__PaginaAdminTutoriais__Editor__Provider = ({ tutorialEmEdicaoId, voltarParaListagem }: Contexto__PaginaAdminTutoriais__Editor__Props) => {
    useConfigurarLayoutContextualizado({ subtitulo: tutorialEmEdicaoId === null ? 'Novo Tutorial' : 'Editar Tutorial', fecharProps: { tipo: 'acao', executar: voltarParaListagem, tituloTooltip: 'Voltar para Listagem' } });

    return (
        <Contexto__PaginaAdminTutoriais__Editor.Provider value={{ tutorialEmEdicaoId, voltarParaListagem }}>
            <SPA__PaginaAdminTutoriais__Editor />
        </Contexto__PaginaAdminTutoriais__Editor.Provider>
    );
};
