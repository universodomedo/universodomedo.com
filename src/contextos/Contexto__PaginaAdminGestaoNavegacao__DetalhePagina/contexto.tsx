'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { obtemNavegacaoDoBanco, obtemLayoutContextos, defineLayoutContexto } from 'Uteis/ApiConsumer/ConsumerMiddleware';
import type { MenuDoBancoDto, LayoutContextoTipo } from 'types-nora-api';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import type { RegistroPaginaNavegacao } from '../Contexto__PaginaAdminGestaoNavegacao/contexto';
import SPA__PaginaAdminGestaoNavegacao__DetalhePagina from 'Conteineres/PaginaAdminGestaoNavegacao/paginas/SPA__PaginaAdminGestaoNavegacao__DetalhePagina/SPA__PaginaAdminGestaoNavegacao__DetalhePagina';

interface Contexto__PaginaAdminGestaoNavegacao__DetalhePagina__Props {
    idMusicaAtual: number | null;
    ativoAtual: boolean;
    iniciarEdicao: () => void;
    salvarMusica: (idMusica: number | null) => Promise<void>;
    definirAtivo: (ativo: boolean) => Promise<void>;
    menusDisponiveis: MenuDoBancoDto[] | null;
    menuInternoTipo: LayoutContextoTipo;
    menuInternoFkMenusId: number | null;
    salvandoMenuInterno: boolean;
    definirMenuInterno: (tipo: LayoutContextoTipo, fkMenusId: number | null) => Promise<void>;
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
    const [menusDisponiveis, setMenusDisponiveis] = useState<MenuDoBancoDto[] | null>(null);
    const [menuInternoTipo, setMenuInternoTipo] = useState<LayoutContextoTipo>('vazio');
    const [menuInternoFkMenusId, setMenuInternoFkMenusId] = useState<number | null>(null);
    const [salvandoMenuInterno, setSalvandoMenuInterno] = useState<boolean>(false);

    // Navegação contextual da visão: título vem da PÁGINA; subtítulo detalha o alvo; o X (fecharProps) volta pra listagem. Sem botão Voltar no corpo.
    useConfigurarLayoutContextualizado({
        subtitulo: `${pagina.label} · ${pagina.chave}`,
        fecharProps: { tipo: 'acao', executar: voltar, tituloTooltip: 'Voltar para a listagem' },
    });

    const template = pagina.template;
    useEffect(() => {
        let vivo = true;
        Promise.all([obtemNavegacaoDoBanco(), obtemLayoutContextos()]).then(([menus, layouts]) => {
            if (!vivo) return;
            setMenusDisponiveis(menus);
            const atual = layouts.find(linha => linha.paginaTemplate === template);
            setMenuInternoTipo(atual ? atual.tipo : 'vazio');
            setMenuInternoFkMenusId(atual ? atual.fkMenusId : null);
        }).catch(() => { if (vivo) setMenusDisponiveis([]); });
        return () => { vivo = false; };
    }, [template]);

    const definirMenuInterno = useCallback(async (tipo: LayoutContextoTipo, fkMenusId: number | null): Promise<void> => {
        setSalvandoMenuInterno(true);
        try {
            const fk = tipo === 'menu' ? fkMenusId : null;
            await defineLayoutContexto({ paginaTemplate: template, tipo, fkMenusId: fk });
            setMenuInternoTipo(tipo);
            setMenuInternoFkMenusId(fk);
        } finally {
            setSalvandoMenuInterno(false);
        }
    }, [template]);

    return (
        <Contexto__PaginaAdminGestaoNavegacao__DetalhePagina.Provider value={{ idMusicaAtual, ativoAtual, iniciarEdicao, salvarMusica, definirAtivo, menusDisponiveis, menuInternoTipo, menuInternoFkMenusId, salvandoMenuInterno, definirMenuInterno }}>
            <SPA__PaginaAdminGestaoNavegacao__DetalhePagina />
        </Contexto__PaginaAdminGestaoNavegacao__DetalhePagina.Provider>
    );
};
