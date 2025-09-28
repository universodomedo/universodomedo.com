import PaginaEvolucaoPersonagem_ComContexto from './componentes';
import { ContextoEdicaoFichaProvider } from 'Contextos/ContextoEdicaoFicha/contexto';

export default function PaginaEvolucaoPersonagem() {
    return (
        <ContextoEdicaoFichaProvider>
            <PaginaEvolucaoPersonagem_ComContexto />
        </ContextoEdicaoFichaProvider>
    );
};