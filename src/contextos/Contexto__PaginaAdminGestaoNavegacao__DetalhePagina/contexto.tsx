'use client';

import { createContext, useContext } from 'react';

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import type { RegistroPaginaNavegacao } from '../Contexto__PaginaAdminGestaoNavegacao/contexto';
import SPA__PaginaAdminGestaoNavegacao__DetalhePagina from 'Conteineres/PaginaAdminGestaoNavegacao/paginas/SPA__PaginaAdminGestaoNavegacao__DetalhePagina/SPA__PaginaAdminGestaoNavegacao__DetalhePagina';

interface Contexto__PaginaAdminGestaoNavegacao__DetalhePagina__Props {
    idMusicaAtual: number | null;
    ativoAtual: boolean;
    iniciarEdicao: () => void;
    salvarMusica: (idMusica: number | null) => Promise<void>;
    definirAtivo: (ativo: boolean) => Promise<void>;
};

type PropsProvider = {
    pagina: RegistroPaginaNavegacao;
    idMusicaAtual: number | null;
    ativoAtual: boolean;
    iniciarEdicao: () => void;
    salvarMusica: (idMusica: number | null) => Promise<void>;
    definirAtivo: (ativo: boolean) => Promise<void>;
    voltar: () => void;
};

const Contexto__PaginaAdminGestaoNavegacao__DetalhePagina = createContext<Contexto__PaginaAdminGestaoNavegacao__DetalhePagina__Props | undefined>(undefined);

export const useContexto__PaginaAdminGestaoNavegacao__DetalhePagina = (): Contexto__PaginaAdminGestaoNavegacao__DetalhePagina__Props => {
    const context = useContext(Contexto__PaginaAdminGestaoNavegacao__DetalhePagina);
    if (!context) throw new Error('useContexto__PaginaAdminGestaoNavegacao__DetalhePagina precisa estar dentro de um Contexto__PaginaAdminGestaoNavegacao__DetalhePagina');
    return context;
};

export const Contexto__PaginaAdminGestaoNavegacao__DetalhePagina__Provider = ({ pagina, idMusicaAtual, ativoAtual, iniciarEdicao, salvarMusica, definirAtivo, voltar }: PropsProvider) => {
    // Navegação contextual da visão: título vem da PÁGINA; subtítulo detalha o alvo; o X (fecharProps) volta pra listagem. Sem botão Voltar no corpo.
    useConfigurarLayoutContextualizado({
        subtitulo: `${pagina.label} · ${pagina.chave}`,
        fecharProps: { tipo: 'acao', executar: voltar, tituloTooltip: 'Voltar para a listagem' },
    });

    return (
        <Contexto__PaginaAdminGestaoNavegacao__DetalhePagina.Provider value={{ idMusicaAtual, ativoAtual, iniciarEdicao, salvarMusica, definirAtivo }}>
            <SPA__PaginaAdminGestaoNavegacao__DetalhePagina />
        </Contexto__PaginaAdminGestaoNavegacao__DetalhePagina.Provider>
    );
};