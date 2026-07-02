'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaGameDesignerDesafios__Provider, useContexto__PaginaGameDesignerDesafios } from 'Contextos/Contexto__PaginaGameDesignerDesafios/contexto';
import { Contexto__PaginaGameDesignerDesafios__Tipos__Provider } from 'Contextos/Contexto__PaginaGameDesignerDesafios__Tipos/contexto';
import { Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo__Provider } from 'Contextos/Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo/contexto';

export default function Conteiner__PaginaGameDesignerDesafios() {
    return (
        <Contexto__PaginaGameDesignerDesafios__Provider>
            <Conteiner__PaginaGameDesignerDesafios__Interno />
        </Contexto__PaginaGameDesignerDesafios__Provider>
    );
};

const Conteiner__PaginaGameDesignerDesafios__Interno = criaConteiner<PropsConteiner__PaginaGameDesignerDesafios>({ useEstado, resolveSaida });

type PropsConteiner__PaginaGameDesignerDesafios = ReturnType<typeof useContexto__PaginaGameDesignerDesafios>;

function resolveSaida(props: PropsConteiner__PaginaGameDesignerDesafios): SaidaConteiner {
    if (props.tipoSelecionado !== null) {
        const grupo = props.estrutura?.grupos.find(grupoTipo => grupoTipo.tipo === props.tipoSelecionado) ?? null;
        if (grupo) return criaSaidaConteiner(Contexto__PaginaGameDesignerDesafios__DesafiosDoTipo__Provider, { grupo, voltaParaTipos: props.voltaParaTipos, alternarAtivoDesafio: props.alternarAtivoDesafio, salvando: props.salvando });
    }

    return criaSaidaConteiner(Contexto__PaginaGameDesignerDesafios__Tipos__Provider, { listagemTipos: props.listagemTipos, selecionaTipo: props.selecionaTipo });
};

function useEstado(): PropsConteiner__PaginaGameDesignerDesafios { return useContexto__PaginaGameDesignerDesafios(); };