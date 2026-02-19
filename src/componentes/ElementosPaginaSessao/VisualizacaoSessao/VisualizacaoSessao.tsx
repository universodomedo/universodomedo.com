import SessaoEmVisualizacao from "Componentes/ElementosVisuais/SessaoEmVisualizacao/page";
import { useContextoPaginasListagemSessoes } from "Contextos/ContextoPaginasListagemSessoes/contexto";
import { useConfigurarLayoutContextualizado } from "Redux/hooks/useLayoutContextualizado";

export function VisualizacaoSessao() {
    const { sessaoSelecionada, deselecionaSessao } = useContextoPaginasListagemSessoes();
    if (!sessaoSelecionada) return;
    useConfigurarLayoutContextualizado({ titulo: `Sessão - ${sessaoSelecionada?.tituloInteligente.tituloCompleto} [#${sessaoSelecionada?.id}]`, fecharProps: { tipo: 'acao', executar: () => deselecionaSessao(), tituloTooltip: 'Voltar para Listagem' } }, 'patch');

    return <SessaoEmVisualizacao sessao={sessaoSelecionada} />;
};