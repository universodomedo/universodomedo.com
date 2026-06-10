'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import { Contexto__PaginaAdminTutoriais__Props } from '../Contexto__PaginaAdminTutoriais/contexto';
import SPA__PaginaAdminTutoriais__Editor from 'Conteineres/PaginaAdminTutoriais/paginas/SPA__PaginaAdminTutoriais__Editor/SPA__PaginaAdminTutoriais__Editor';
import { EditorTutorialEstado, useEditorTutorial } from './useEditorTutorial';

type PropsProvider = {
    tutorialEmEdicaoId: Contexto__PaginaAdminTutoriais__Props['tutorialEmEdicaoId'];
    voltarParaListagem: Contexto__PaginaAdminTutoriais__Props['voltarParaListagem'];
    concluiSalvamento: Contexto__PaginaAdminTutoriais__Props['concluiSalvamento'];
};

export type Contexto__PaginaAdminTutoriais__Editor__Props = EditorTutorialEstado & { voltarParaListagem: () => void };

const Contexto__PaginaAdminTutoriais__Editor = createContext<Contexto__PaginaAdminTutoriais__Editor__Props | undefined>(undefined);

export const useContexto__PaginaAdminTutoriais__Editor = (): Contexto__PaginaAdminTutoriais__Editor__Props => {
    const context = useContext(Contexto__PaginaAdminTutoriais__Editor);
    if (!context) throw new Error('useContexto__PaginaAdminTutoriais__Editor precisa estar dentro de um Contexto__PaginaAdminTutoriais__Editor');
    return context;
};

export const Contexto__PaginaAdminTutoriais__Editor__Provider = ({ tutorialEmEdicaoId, voltarParaListagem, concluiSalvamento }: PropsProvider) => {
    const estaEditando = tutorialEmEdicaoId !== null;
    useConfigurarLayoutContextualizado({ subtitulo: estaEditando ? 'Editar Tutorial' : 'Novo Tutorial', fecharProps: { tipo: 'acao', executar: voltarParaListagem, tituloTooltip: 'Voltar para Listagem' } });

    const editor = useEditorTutorial(tutorialEmEdicaoId, concluiSalvamento);

    return (
        <Contexto__PaginaAdminTutoriais__Editor.Provider value={{ ...editor, voltarParaListagem }}>
            <SPA__PaginaAdminTutoriais__Editor />
        </Contexto__PaginaAdminTutoriais__Editor.Provider>
    );
};
