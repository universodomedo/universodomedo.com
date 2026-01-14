import { EstiloSessao, SessaoDto } from "types-nora-api";

import { useConfigurarLayoutContextualizado } from 'Redux/hooks/useLayoutContextualizado';
import SessaoEmVisualizacao from "Componentes/ElementosVisuais/SessaoEmVisualizacao/page";

export function VisualizacaoSessao({ sessaoSelecionada }: { sessaoSelecionada: SessaoDto }) {
	useConfigurarLayoutContextualizado({ proporcaoConteudo: 100, fecharProps: { tipo: 'href', hrefPaginaRetorno: '/sessoes', tituloTooltip: 'Voltar' } });

    return (
        <>
            <h1>Sessão {sessaoSelecionada.id} - {sessaoSelecionada.estiloSessao}</h1>

            {sessaoSelecionada.estiloSessao && sessaoSelecionada.estiloSessao !== EstiloSessao.ERRO && <SessaoEmVisualizacao sessao={sessaoSelecionada} />}
        </>
    );
};