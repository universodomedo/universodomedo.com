import { useContexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada } from "Contextos/Contexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada/contexto";
import AvisosSessoesPrevistas from "Componentes/ElementosVisuais/ElementosIndividuaisEmListaDeVisualizacao/AvisosSessoesPrevistas/AvisosSessoesPrevistas";

export default function SPA__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada() {
    const { sessoes, selecionaSessao } = useContexto__PaginaPreJogo_Jogador_SemSessaoPrevistaSelecionada();
    
    return (
        <AvisosSessoesPrevistas sessoes={sessoes} selecionaSessao={selecionaSessao} />
    );
};