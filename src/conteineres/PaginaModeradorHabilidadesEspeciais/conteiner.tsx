'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaModeradorHabilidadesEspeciais__Provider, useContexto__PaginaModeradorHabilidadesEspeciais } from 'Contextos/Contexto__PaginaModeradorHabilidadesEspeciais/contexto';
import { Contexto__PaginaModeradorHabilidadesEspeciais__Detalhe__Provider } from 'Contextos/Contexto__PaginaModeradorHabilidadesEspeciais__Detalhe/contexto';
import { Contexto__PaginaModeradorHabilidadesEspeciais__Listagem__Provider } from 'Contextos/Contexto__PaginaModeradorHabilidadesEspeciais__Listagem/contexto';
import { Contexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade__Provider } from 'Contextos/Contexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade/contexto';

export default function Conteiner__PaginaModeradorHabilidadesEspeciais() {
    return (
        <Contexto__PaginaModeradorHabilidadesEspeciais__Provider>
            <Conteiner__PaginaModeradorHabilidadesEspeciais__Interno />
        </Contexto__PaginaModeradorHabilidadesEspeciais__Provider>
    );
};

const Conteiner__PaginaModeradorHabilidadesEspeciais__Interno = criaConteiner<PropsConteiner__PaginaModeradorHabilidadesEspeciais>({ useEstado, resolveSaida });

type PropsConteiner__PaginaModeradorHabilidadesEspeciais = ReturnType<typeof useContexto__PaginaModeradorHabilidadesEspeciais>;

function resolveSaida(props: PropsConteiner__PaginaModeradorHabilidadesEspeciais): SaidaConteiner {
    if (props.habilidadeSelecionada) return criaSaidaConteiner(Contexto__PaginaModeradorHabilidadesEspeciais__Detalhe__Provider, { habilidade: props.habilidadeSelecionada, deselecionaHabilidade: props.deselecionaHabilidade });
    if (props.estaEmProcessoCriacao) return criaSaidaConteiner(Contexto__PaginaModeradorHabilidadesEspeciais__NovaHabilidade__Provider, { cancelaCriacao: props.cancelaCriacao, concluiCriacao: props.concluiCriacao });

    return criaSaidaConteiner(Contexto__PaginaModeradorHabilidadesEspeciais__Listagem__Provider, { listagemHabilidades: props.listagemHabilidades, estaEmProcessoCriacao: props.estaEmProcessoCriacao, iniciaCriacao: props.iniciaCriacao, selecionaHabilidade: props.selecionaHabilidade });
};

function useEstado(): PropsConteiner__PaginaModeradorHabilidadesEspeciais { return useContexto__PaginaModeradorHabilidadesEspeciais(); };
