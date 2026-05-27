'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaModeradorConfiguracaoHabilidades__Provider, useContexto__PaginaModeradorConfiguracaoHabilidades } from 'Contextos/Contexto__PaginaModeradorConfiguracaoHabilidades/contexto';
import { Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Provider } from 'Contextos/Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao/contexto';
import { Contexto__PaginaModeradorConfiguracaoHabilidades__Listagem__Provider } from 'Contextos/Contexto__PaginaModeradorConfiguracaoHabilidades__Listagem/contexto';

export default function Conteiner__PaginaModeradorConfiguracaoHabilidades() {
    return (
        <Contexto__PaginaModeradorConfiguracaoHabilidades__Provider>
            <Conteiner__PaginaModeradorConfiguracaoHabilidades__Interno />
        </Contexto__PaginaModeradorConfiguracaoHabilidades__Provider>
    );
};

const Conteiner__PaginaModeradorConfiguracaoHabilidades__Interno = criaConteiner<PropsConteiner__PaginaModeradorConfiguracaoHabilidades>({ useEstado, resolveSaida });

type PropsConteiner__PaginaModeradorConfiguracaoHabilidades = ReturnType<typeof useContexto__PaginaModeradorConfiguracaoHabilidades>;

function resolveSaida(props: PropsConteiner__PaginaModeradorConfiguracaoHabilidades): SaidaConteiner {
    if (props.habilidadeSelecionada) return criaSaidaConteiner(Contexto__PaginaModeradorConfiguracaoHabilidades__Configuracao__Provider, { habilidade: props.habilidadeSelecionada, deselecionaHabilidade: props.deselecionaHabilidade });

    return criaSaidaConteiner(Contexto__PaginaModeradorConfiguracaoHabilidades__Listagem__Provider, { listagemHabilidades: props.listagemHabilidades, selecionaHabilidade: props.selecionaHabilidade });
};

function useEstado(): PropsConteiner__PaginaModeradorConfiguracaoHabilidades { return useContexto__PaginaModeradorConfiguracaoHabilidades(); };