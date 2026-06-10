'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaAdminTutoriais__Provider, useContexto__PaginaAdminTutoriais } from 'Contextos/Contexto__PaginaAdminTutoriais/contexto';
import { Contexto__PaginaAdminTutoriais__Editor__Provider } from 'Contextos/Contexto__PaginaAdminTutoriais__Editor/contexto';
import { Contexto__PaginaAdminTutoriais__Listagem__Provider } from 'Contextos/Contexto__PaginaAdminTutoriais__Listagem/contexto';

export default function Conteiner__PaginaAdminTutoriais() {
    return (
        <Contexto__PaginaAdminTutoriais__Provider>
            <Conteiner__PaginaAdminTutoriais__Interno />
        </Contexto__PaginaAdminTutoriais__Provider>
    );
};

const Conteiner__PaginaAdminTutoriais__Interno = criaConteiner<PropsConteiner__PaginaAdminTutoriais>({ useEstado, resolveSaida });

type PropsConteiner__PaginaAdminTutoriais = ReturnType<typeof useContexto__PaginaAdminTutoriais>;

function resolveSaida(props: PropsConteiner__PaginaAdminTutoriais): SaidaConteiner {
    if (props.estadoFluxo === 'EDITOR') return criaSaidaConteiner(Contexto__PaginaAdminTutoriais__Editor__Provider, { tutorialEmEdicaoId: props.tutorialEmEdicaoId, voltarParaListagem: props.voltarParaListagem, concluiSalvamento: props.concluiSalvamento });

    return criaSaidaConteiner(Contexto__PaginaAdminTutoriais__Listagem__Provider, { listagemTutoriais: props.listagemTutoriais, iniciaCriacao: props.iniciaCriacao, iniciaEdicao: props.iniciaEdicao });
};

function useEstado(): PropsConteiner__PaginaAdminTutoriais { return useContexto__PaginaAdminTutoriais(); };
