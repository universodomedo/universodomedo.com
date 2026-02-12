'use client';

import { EstiloSessao, PAGINAS } from 'types-nora-api';

import { ContextoPaginaMestreSessaoProvider, useContextoPaginaMestreSessao } from 'Contextos/ContextoMestreSessao/contexto';
import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SessaoEmVisualizacao from 'Componentes/ElementosVisuais/SessaoEmVisualizacao/page';
import { DestinoInput } from 'Funcionalidades/navegacaoInterna';
import { ControladorSlot } from 'Layouts/ControladorSlot';

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
    const { sessaoSelecionada } = useContextoPaginaMestreSessao();

    const paginaRetorno: DestinoInput = sessaoSelecionada.estiloSessao == EstiloSessao.SESSAO_DE_AVENTURA
        ? { pagina: PAGINAS.minhasPaginas.mestre.aventura, params: { id: String(sessaoSelecionada.detalheSessaoAventura.grupoAventura.id) } }
        : PAGINAS.minhasPaginas.mestre.sessoesUnicas

    useConfigurarLayoutContextualizado({ fecharProps: { tipo: 'href', paginaRetorno: paginaRetorno, tituloTooltip: 'Voltar' } });

    return (
        <>
            <SessaoEmVisualizacao sessao={sessaoSelecionada} />

            {/* <ListaInfracoesSessao /> */}
        </>
    );
};