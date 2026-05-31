'use client';

import { criaConteiner, criaSaidaConteiner, SaidaConteiner } from 'Conteineres/_core/criaConteiner';

import { Contexto__PaginaModeradorConfiguracaoSeresInatos__Provider, useContexto__PaginaModeradorConfiguracaoSeresInatos } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos/contexto';
import { Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao__Provider } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao/contexto';
import { Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade__Provider } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade/contexto';
import { Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer__Provider } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer/contexto';
import { Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes__Provider } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes/contexto';
import { Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades__Provider } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades/contexto';
import { Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres__Provider } from 'Contextos/Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres/contexto';

export default function Conteiner__PaginaModeradorConfiguracaoSeresInatos() {
    return (
        <Contexto__PaginaModeradorConfiguracaoSeresInatos__Provider>
            <Conteiner__PaginaModeradorConfiguracaoSeresInatos__Interno />
        </Contexto__PaginaModeradorConfiguracaoSeresInatos__Provider>
    );
};

const Conteiner__PaginaModeradorConfiguracaoSeresInatos__Interno = criaConteiner<PropsConteiner__PaginaModeradorConfiguracaoSeresInatos>({ useEstado, resolveSaida });

type PropsConteiner__PaginaModeradorConfiguracaoSeresInatos = ReturnType<typeof useContexto__PaginaModeradorConfiguracaoSeresInatos>;

function resolveSaida(props: PropsConteiner__PaginaModeradorConfiguracaoSeresInatos): SaidaConteiner {
    if (props.fluxo === 'formulario_acao') return criaSaidaConteiner(Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioAcao__Provider, { acaoInicial: props.acaoEmEdicao, aoVoltar: props.selecionaListagemAcoes });
    if (props.fluxo === 'listagem_capacidades') return criaSaidaConteiner(Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemCapacidades__Provider, { iniciaNovaCapacidade: props.iniciaNovaCapacidade, editaCapacidade: props.editaCapacidade });
    if (props.fluxo === 'formulario_capacidade') return criaSaidaConteiner(Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioCapacidade__Provider, { capacidadeInicial: props.capacidadeEmEdicao, aoVoltar: props.selecionaListagemCapacidades });
    if (props.fluxo === 'listagem_tipos_seres') return criaSaidaConteiner(Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemTiposSeres__Provider, { iniciaNovoTipoSer: props.iniciaNovoTipoSer, editaTipoSer: props.editaTipoSer });
    if (props.fluxo === 'formulario_tipo_ser') return criaSaidaConteiner(Contexto__PaginaModeradorConfiguracaoSeresInatos__FormularioTipoSer__Provider, { tipoSerInicial: props.tipoSerEmEdicao, aoVoltar: props.selecionaListagemTiposSeres });

    return criaSaidaConteiner(Contexto__PaginaModeradorConfiguracaoSeresInatos__ListagemAcoes__Provider, { iniciaNovaAcao: props.iniciaNovaAcao, editaAcao: props.editaAcao });
};

function useEstado(): PropsConteiner__PaginaModeradorConfiguracaoSeresInatos { return useContexto__PaginaModeradorConfiguracaoSeresInatos(); };