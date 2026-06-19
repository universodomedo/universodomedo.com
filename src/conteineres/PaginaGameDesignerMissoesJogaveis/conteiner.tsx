'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGameDesignerMissoesJogaveis__Provider, useContexto__PaginaGameDesignerMissoesJogaveis } from 'Contextos/Contexto__PaginaGameDesignerMissoesJogaveis/contexto';
import SPA__PaginaGameDesignerMissoesJogaveis from './paginas/SPA__PaginaGameDesignerMissoesJogaveis/SPA__PaginaGameDesignerMissoesJogaveis';

export default function Conteiner__PaginaGameDesignerMissoesJogaveis() {
    return (
        <Contexto__PaginaGameDesignerMissoesJogaveis__Provider>
            <Conteiner__PaginaGameDesignerMissoesJogaveis__Interno />
        </Contexto__PaginaGameDesignerMissoesJogaveis__Provider>
    );
};

const Conteiner__PaginaGameDesignerMissoesJogaveis__Interno = criaConteiner<PropsConteiner__PaginaGameDesignerMissoesJogaveis>({ useEstado, resolveSaida });

type PropsConteiner__PaginaGameDesignerMissoesJogaveis = ReturnType<typeof useContexto__PaginaGameDesignerMissoesJogaveis>;

function resolveSaida(_props: PropsConteiner__PaginaGameDesignerMissoesJogaveis): SaidaConteiner {
    return criaSaidaConteiner(SPA__PaginaGameDesignerMissoesJogaveis, {});
};

function useEstado(): PropsConteiner__PaginaGameDesignerMissoesJogaveis { return useContexto__PaginaGameDesignerMissoesJogaveis(); };
