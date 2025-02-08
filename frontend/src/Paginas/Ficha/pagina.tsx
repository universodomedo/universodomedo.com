// #region Imports
import { ContextoFichaProvider } from 'Contextos/ContextoPersonagem/contexto.tsx';
import { useClasseContextualPersonagemPendenciasNexUp } from "Classes/ClassesContextuais/PersonagemPendenciasNexUp";

import PaginaFicha from 'Paginas/Ficha/paginaFichaJogo.tsx';
import PaginaEditaFicha from 'Paginas/Ficha/paginaFichaEdicao';

// #endregion

const pagina = ({ seletorFicha }: { seletorFicha: { tipo: 'ficha'; idFichaNoLocalStorage: number } | { tipo: 'fichaDemonstracao' } }) => {
    // fazendo commit para testar gpg pelo turtoise
    
    return (
        <ContextoFichaProvider seletorFicha={seletorFicha}>
            <InterseccaoParaPendencia />
        </ContextoFichaProvider>
    );
}

const InterseccaoParaPendencia = () => {
    const { temPendencias } = useClasseContextualPersonagemPendenciasNexUp();

    return (
        <>
            {temPendencias ? (
                <PaginaEditaFicha />
            ) : (
                <PaginaFicha />
            )}
        </>
    );
}


export default pagina;