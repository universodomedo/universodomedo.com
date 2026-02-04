import { ContextoEdicaoFichaProvider } from "./contexto";
import PaginaEvolucaoPersonagem_ComContexto from "Componentes/PaginasFicha/EvolucaoFicha/componentes";

export default function RecipienteEdicaoFicha() {
    return (
        <ContextoEdicaoFichaProvider>
            <PaginaEvolucaoPersonagem_ComContexto />
        </ContextoEdicaoFichaProvider>
    );
};