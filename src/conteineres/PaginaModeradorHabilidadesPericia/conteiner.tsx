'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaModeradorHabilidadesPericia__Provider, useContexto__PaginaModeradorHabilidadesPericia } from 'Contextos/Contexto__PaginaModeradorHabilidadesPericia/contexto';
import { Contexto__PaginaModeradorHabilidadesPericia__Detalhe__Provider } from 'Contextos/Contexto__PaginaModeradorHabilidadesPericia__Detalhe/contexto';
import { Contexto__PaginaModeradorHabilidadesPericia__Listagem__Provider } from 'Contextos/Contexto__PaginaModeradorHabilidadesPericia__Listagem/contexto';
import { Contexto__PaginaModeradorHabilidadesPericia__NovaHabilidade__Provider } from 'Contextos/Contexto__PaginaModeradorHabilidadesPericia__NovaHabilidade/contexto';

export default function Conteiner__PaginaModeradorHabilidadesPericia() {
    return (
        <Contexto__PaginaModeradorHabilidadesPericia__Provider>
            <Conteiner__PaginaModeradorHabilidadesPericia__Interno />
        </Contexto__PaginaModeradorHabilidadesPericia__Provider>
    );
};

const Conteiner__PaginaModeradorHabilidadesPericia__Interno = criaConteiner<PropsConteiner__PaginaModeradorHabilidadesPericia>({ useEstado, resolveSaida });

type PropsConteiner__PaginaModeradorHabilidadesPericia = ReturnType<typeof useContexto__PaginaModeradorHabilidadesPericia>;

function resolveSaida(props: PropsConteiner__PaginaModeradorHabilidadesPericia): SaidaConteiner {
    if (props.habilidadeSelecionada) return criaSaidaConteiner(Contexto__PaginaModeradorHabilidadesPericia__Detalhe__Provider, { habilidade: props.habilidadeSelecionada, deselecionaHabilidade: props.deselecionaHabilidade });
    if (props.estaEmProcessoCriacao) return criaSaidaConteiner(Contexto__PaginaModeradorHabilidadesPericia__NovaHabilidade__Provider, { pericias: props.pericias, patentes: props.patentes, cancelaCriacao: props.cancelaCriacao, concluiCriacao: props.concluiCriacao });

    return criaSaidaConteiner(Contexto__PaginaModeradorHabilidadesPericia__Listagem__Provider, { listagemHabilidades: props.listagemHabilidades, estaEmProcessoCriacao: props.estaEmProcessoCriacao, iniciaCriacao: props.iniciaCriacao, selecionaHabilidade: props.selecionaHabilidade });
};

function useEstado(): PropsConteiner__PaginaModeradorHabilidadesPericia { return useContexto__PaginaModeradorHabilidadesPericia(); };