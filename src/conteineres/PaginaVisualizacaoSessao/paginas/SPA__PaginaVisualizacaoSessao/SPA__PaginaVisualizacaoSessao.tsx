import { useContextoPaginaVisualizacaoSessao } from 'Contextos/ContextoPaginaVisualizacaoSessao/contexto';
import SessaoEmVisualizacao from 'Componentes/ElementosVisuais/SessaoEmVisualizacao/SessaoEmVisualizacao';

export default function SPA__PaginaVisualizacaoSessao() {
    const { sessao } = useContextoPaginaVisualizacaoSessao();
    
    return <SessaoEmVisualizacao sessao={sessao} />;
};