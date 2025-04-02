import { obtemTodasAventuras } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import PaginaAventurasComDados from './page-dados.tsx';
import { ContextoPaginaAventuraProvider } from 'Contextos/ContextoPaginaAventura/contexto.tsx';

export default async function PaginaAventuras() {
    const respostaDadosPaginaAventuras = await obtemTodasAventuras();

    if (!respostaDadosPaginaAventuras.sucesso || !respostaDadosPaginaAventuras.dados) return <div>Erro ao carregar aventuras</div>;

    return (
        <ContextoPaginaAventuraProvider>
            <PaginaAventurasComDados dadosAventuras={respostaDadosPaginaAventuras.dados}/>
        </ContextoPaginaAventuraProvider>
    )
};