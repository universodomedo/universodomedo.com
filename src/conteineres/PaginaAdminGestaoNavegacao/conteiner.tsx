'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaAdminGestaoNavegacao__Props, Contexto__PaginaAdminGestaoNavegacao__Provider, useContexto__PaginaAdminGestaoNavegacao } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao/contexto';
import { Contexto__PaginaAdminGestaoNavegacao__Listagem__Provider } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao__Listagem/contexto';
import { Contexto__PaginaAdminGestaoNavegacao__DetalhePagina__Provider } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao__DetalhePagina/contexto';
import { Contexto__PaginaAdminGestaoNavegacao__EdicaoMusica__Provider } from 'Contextos/Contexto__PaginaAdminGestaoNavegacao__EdicaoMusica/contexto';

export function Conteiner__PaginaAdminGestaoNavegacao() {
    return (
        <Contexto__PaginaAdminGestaoNavegacao__Provider>
            <Conteiner__PaginaAdminGestaoNavegacao__Interno />
        </Contexto__PaginaAdminGestaoNavegacao__Provider>
    );
};

export const Conteiner__PaginaAdminGestaoNavegacao__Interno = criaConteiner<PropsConteiner__PaginaAdminGestaoNavegacao>({ useEstado, resolveSaida });

type PropsConteiner__PaginaAdminGestaoNavegacao = Contexto__PaginaAdminGestaoNavegacao__Props;

// Fluxo controlado aqui (não dentro das SPAs): sem página selecionada → Listagem; selecionada + editando → Edição de Música; selecionada → Detalhe da página.
function resolveSaida(props: PropsConteiner__PaginaAdminGestaoNavegacao): SaidaConteiner {
    if (props.paginaSelecionada === null) return criaSaidaConteiner(Contexto__PaginaAdminGestaoNavegacao__Listagem__Provider, { listagemPaginas: props.listagemPaginas, selecionarPagina: props.selecionarPagina });

    if (props.editando) return criaSaidaConteiner(Contexto__PaginaAdminGestaoNavegacao__EdicaoMusica__Provider, { pagina: props.paginaSelecionada, idMusicaAtual: props.idMusicaAtual, salvarMusica: props.salvarMusica, voltarParaVisao: props.voltarParaVisao });

    return criaSaidaConteiner(Contexto__PaginaAdminGestaoNavegacao__DetalhePagina__Provider, { pagina: props.paginaSelecionada, idMusicaAtual: props.idMusicaAtual, ativoAtual: props.ativoAtual, iniciarEdicao: props.iniciarEdicao, salvarMusica: props.salvarMusica, definirAtivo: props.definirAtivo, voltar: props.voltar });
};

function useEstado(): PropsConteiner__PaginaAdminGestaoNavegacao { return useContexto__PaginaAdminGestaoNavegacao(); };