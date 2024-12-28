// #region Imports
import { ContextoArmaProvider, useContextoArma } from './contextoArma.tsx';
// #endregion

const page = () => {
    

    return (
        <ContextoArmaProvider>
            <PageComContexto />
        </ContextoArmaProvider>
    );
}

const PageComContexto = () => {
    const { idPaginaArmaAberta, paginasArma } = useContextoArma();

    return (
        <>
            {paginasArma[idPaginaArmaAberta]}
        </>
    );
}

export default page;