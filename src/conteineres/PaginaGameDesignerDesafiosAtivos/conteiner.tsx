'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGameDesignerDesafiosAtivos__Provider, useContexto__PaginaGameDesignerDesafiosAtivos } from 'Contextos/Contexto__PaginaGameDesignerDesafiosAtivos/contexto';
import SPA__PaginaGameDesignerDesafiosAtivos from './paginas/SPA__PaginaGameDesignerDesafiosAtivos/SPA__PaginaGameDesignerDesafiosAtivos';

export default function Conteiner__PaginaGameDesignerDesafiosAtivos() {
    return (
        <Contexto__PaginaGameDesignerDesafiosAtivos__Provider>
            <Conteiner__PaginaGameDesignerDesafiosAtivos__Interno />
        </Contexto__PaginaGameDesignerDesafiosAtivos__Provider>
    );
};

const Conteiner__PaginaGameDesignerDesafiosAtivos__Interno = criaConteiner<PropsConteiner__PaginaGameDesignerDesafiosAtivos>({ useEstado, resolveSaida });

type PropsConteiner__PaginaGameDesignerDesafiosAtivos = ReturnType<typeof useContexto__PaginaGameDesignerDesafiosAtivos>;

function resolveSaida(_props: PropsConteiner__PaginaGameDesignerDesafiosAtivos): SaidaConteiner {
    return criaSaidaConteiner(SPA__PaginaGameDesignerDesafiosAtivos, {});
};

function useEstado(): PropsConteiner__PaginaGameDesignerDesafiosAtivos { return useContexto__PaginaGameDesignerDesafiosAtivos(); };
