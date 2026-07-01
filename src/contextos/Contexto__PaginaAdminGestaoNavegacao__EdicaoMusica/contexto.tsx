'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import type { RegistroPaginaNavegacao } from '../Contexto__PaginaAdminGestaoNavegacao/contexto';
import SPA__PaginaAdminGestaoNavegacao__EdicaoMusica from 'Conteineres/PaginaAdminGestaoNavegacao/paginas/SPA__PaginaAdminGestaoNavegacao__EdicaoMusica/SPA__PaginaAdminGestaoNavegacao__EdicaoMusica';

interface Contexto__PaginaAdminGestaoNavegacao__EdicaoMusica__Props {
    idMusicaAtual: number | null;
    salvarMusica: (idMusica: number | null) => Promise<void>;
};

type PropsProvider = {
    pagina: RegistroPaginaNavegacao;
    idMusicaAtual: number | null;
    salvarMusica: (idMusica: number | null) => Promise<void>;
    voltarParaVisao: () => void;
};

const Contexto__PaginaAdminGestaoNavegacao__EdicaoMusica = createContext<Contexto__PaginaAdminGestaoNavegacao__EdicaoMusica__Props | undefined>(undefined);

export const useContexto__PaginaAdminGestaoNavegacao__EdicaoMusica = (): Contexto__PaginaAdminGestaoNavegacao__EdicaoMusica__Props => {
    const context = useContext(Contexto__PaginaAdminGestaoNavegacao__EdicaoMusica);
    if (!context) throw new Error('useContexto__PaginaAdminGestaoNavegacao__EdicaoMusica precisa estar dentro de um Contexto__PaginaAdminGestaoNavegacao__EdicaoMusica');
    return context;
};

export const Contexto__PaginaAdminGestaoNavegacao__EdicaoMusica__Provider = ({ pagina, idMusicaAtual, salvarMusica, voltarParaVisao }: PropsProvider) => {
    // Navegação contextual do editor: subtítulo detalha o alvo + o editor; o X (fecharProps) volta um nível, pra visão. Sem botão Voltar no corpo.
    useConfigurarLayoutContextualizado({
        subtitulo: `${pagina.label} · Música de Fundo`,
        fecharProps: { tipo: 'acao', executar: voltarParaVisao, tituloTooltip: 'Voltar' },
    });

    return (
        <Contexto__PaginaAdminGestaoNavegacao__EdicaoMusica.Provider value={{ idMusicaAtual, salvarMusica }}>
            <SPA__PaginaAdminGestaoNavegacao__EdicaoMusica />
        </Contexto__PaginaAdminGestaoNavegacao__EdicaoMusica.Provider>
    );
};