'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaModeradorConquistas__Provider, useContexto__PaginaModeradorConquistas } from 'Contextos/Contexto__PaginaModeradorConquistas/contexto';
// import { Contexto__PaginaModeradorConquistas__ComAventuraSelecionada__Provider } from 'Contextos/Contexto__PaginaModeradorConquistas__ComAventuraSelecionada/contextos';
// import { Contexto__PaginaModeradorConquistas__SemAventuraSelecionada__Provider } from 'Contextos/Contexto__PaginaModeradorConquistas__SemAventuraSelecionada/contexto';

export default function Conteiner__PaginaModeradorConquistas() {
    return (
        <Contexto__PaginaModeradorConquistas__Provider>
            <Conteiner__PaginaModeradorConquistas__Interno />
        </Contexto__PaginaModeradorConquistas__Provider>
    );
};

const Conteiner__PaginaModeradorConquistas__Interno = criaConteiner<PropsConteiner__PaginaModeradorConquistas>({ useEstado, resolveSaida });

type PropsConteiner__PaginaModeradorConquistas = ReturnType<typeof useContexto__PaginaModeradorConquistas>;

function resolveSaida(props: PropsConteiner__PaginaModeradorConquistas): SaidaConteiner {
    // if (props.grupoAventuraSelecionado) return criaSaidaConteiner(Contexto__PaginaModeradorConquistas__ComAventuraSelecionada__Provider, { grupoAventura: props.grupoAventuraSelecionado, deselecionaGrupoAventura: props.deselecionaGrupoAventura })

    // return criaSaidaConteiner(Contexto__PaginaModeradorConquistas__SemAventuraSelecionada__Provider, { gruposAventuras: props.listagemGruposAventuras, selecionaGrupoAventura: props.setIdGrupoAventuraSelecionada });

    return criaSaidaConteiner(nullable, {});
};

function useEstado(): PropsConteiner__PaginaModeradorConquistas { return useContexto__PaginaModeradorConquistas(); };

function nullable() { return <></>; };