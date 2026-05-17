'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaModeradorEmblemas__Provider, useContexto__PaginaModeradorEmblemas } from 'Contextos/Contexto__PaginaModeradorEmblemas/contexto';
// import { Contexto__PaginaModeradorEmblemas__ComAventuraSelecionada__Provider } from 'Contextos/Contexto__PaginaModeradorEmblemas__ComEmblemaSelecionado/contextos';
// import { Contexto__PaginaModeradorEmblemas__SemAventuraSelecionada__Provider } from 'Contextos/Contexto__PaginaModeradorEmblemas__SemEmblemaSelecionado/contexto';

export default function Conteiner__PaginaModeradorEmblemas() {
    return (
        <Contexto__PaginaModeradorEmblemas__Provider>
            <Conteiner__PaginaModeradorEmblemas__Interno />
        </Contexto__PaginaModeradorEmblemas__Provider>
    );
};

const Conteiner__PaginaModeradorEmblemas__Interno = criaConteiner<PropsConteiner__PaginaModeradorEmblemas>({ useEstado, resolveSaida });

type PropsConteiner__PaginaModeradorEmblemas = ReturnType<typeof useContexto__PaginaModeradorEmblemas>;

function resolveSaida(props: PropsConteiner__PaginaModeradorEmblemas): SaidaConteiner {
    // if (props.grupoAventuraSelecionado) return criaSaidaConteiner(Contexto__PaginaModeradorEmblemas__ComAventuraSelecionada__Provider, { grupoAventura: props.grupoAventuraSelecionado, deselecionaGrupoAventura: props.deselecionaGrupoAventura })

    // return criaSaidaConteiner(Contexto__PaginaModeradorEmblemas__SemAventuraSelecionada__Provider, { gruposAventuras: props.listagemGruposAventuras, selecionaGrupoAventura: props.setIdGrupoAventuraSelecionada });

    return criaSaidaConteiner(nullable, {});
};

function useEstado(): PropsConteiner__PaginaModeradorEmblemas { return useContexto__PaginaModeradorEmblemas(); };

function nullable() { return <></>; };