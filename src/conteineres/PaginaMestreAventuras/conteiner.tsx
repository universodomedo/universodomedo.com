'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaMestreAventuras__Provider, useContexto__PaginaMestreAventuras } from 'Contextos/Contexto__PaginaMestreAventuras/contexto';
import { Contexto__PaginaMestreAventuras__ComAventuraSelecionada__Provider } from 'Contextos/Contexto__PaginaMestreAventuras__ComAventuraSelecionada/contextos';
import { Contexto__PaginaMestreAventuras__SemAventuraSelecionada__Provider } from 'Contextos/Contexto__PaginaMestreAventuras__SemAventuraSelecionada/contexto';

export default function Conteiner__PaginaMestreAventuras() {
    return (
        <Contexto__PaginaMestreAventuras__Provider>
            <Conteiner__PaginaMestreAventuras__Interno />
        </Contexto__PaginaMestreAventuras__Provider>
    );
};

const Conteiner__PaginaMestreAventuras__Interno = criaConteiner<PropsConteiner__PaginaMestreAventuras>({ useEstado, resolveSaida });

type PropsConteiner__PaginaMestreAventuras = ReturnType<typeof useContexto__PaginaMestreAventuras>;

function resolveSaida(props: PropsConteiner__PaginaMestreAventuras): SaidaConteiner {
    if (props.idGrupoAventuraSelecionada) return criaSaidaConteiner(Contexto__PaginaMestreAventuras__ComAventuraSelecionada__Provider, { idGrupoAventuraSelecionado: props.idGrupoAventuraSelecionada, deselecionaGrupoAventura: props.deselecionaGrupoAventura })

    return criaSaidaConteiner(Contexto__PaginaMestreAventuras__SemAventuraSelecionada__Provider, { gruposAventuras: props.listagemGruposAventuras, selecionaGrupoAventura: props.setIdGrupoAventuraSelecionada });
};

function useEstado(): PropsConteiner__PaginaMestreAventuras { return useContexto__PaginaMestreAventuras(); };