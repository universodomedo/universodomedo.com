'use client';

import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import { ContextoPaginaMestreSessaoProvider, useContextoPaginaMestreSessao } from 'Contextos/ContextoMestreSessao/contexto';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SessaoEmVisualizacao from 'Componentes/ElementosVisuais/SessaoEmVisualizacao/SessaoEmVisualizacao';
import { DestinoInput } from 'Funcionalidades/navegacaoInterna';
import ConfiguradorCapa from 'Componentes/Elementos/ConfiguradorCapa/ConfiguradorCapa';

export function PaginaMestreSessao_Client({ idSessao }: { idSessao: number }) {
    return (
        <ControladorSlot pagina={PAGINAS.minhasPaginas.mestre.sessao}>
            <ContextoPaginaMestreSessaoProvider idSessao={idSessao}>
                <PaginaMestreSessao_Conteudo />
            </ContextoPaginaMestreSessaoProvider>
        </ControladorSlot>
    );
};

function PaginaMestreSessao_Conteudo() {
    const { sessaoSelecionada, callbackSelecionaArquivo } = useContextoPaginaMestreSessao();

    const paginaRetorno: DestinoInput = sessaoSelecionada.tipo == 'AVENTURA'
        // ? { pagina: PAGINAS.minhasPaginas.mestre.aventura, params: { id: String(sessaoSelecionada.detalheSessaoAventura.grupoAventura.id) } }
        ? { pagina: PAGINAS.minhasPaginas.mestre.aventura, params: { id: 1 } }
        : PAGINAS.minhasPaginas.mestre.sessoesUnicas

    useConfigurarLayoutContextualizado({ titulo: sessaoSelecionada.tituloInteligente.tituloCompleto, fecharProps: { tipo: 'href', paginaRetorno: paginaRetorno, tituloTooltip: 'Voltar' } });

    return (
        <>
            <SessaoEmVisualizacao sessao={sessaoSelecionada} />

            {!sessaoSelecionada.dadosArteCapa.temCapaConfigurada && <ConfiguradorCapa cabecalho={{ titulo: 'Selecionando Capa', subtitulo: sessaoSelecionada.tituloInteligente.tituloCompleto }} callbackSelecionaArquivo={callbackSelecionaArquivo} />}

            {/* <ListaInfracoesSessao /> */}
        </>
    );
};