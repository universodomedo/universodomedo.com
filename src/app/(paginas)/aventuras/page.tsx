import { ControladorSlot } from 'Layouts/ControladorSlot';

import { obtemTodasAventuras } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import PaginaAventurasComDados from './page-dados.tsx';
import { ContextoPaginaAventuraProvider } from 'Contextos/ContextoPaginaAventura/contexto.tsx';

export default function PaginaAcessar() {
    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: false }}>
            <PaginaAventuras />
        </ControladorSlot>
    );
};

export async function PaginaAventuras() {
    const respostaDadosPaginaAventuras = await obtemTodasAventuras();

    if (!respostaDadosPaginaAventuras) return <div>Erro ao carregar aventuras</div>;

    return (
        <ContextoPaginaAventuraProvider>
            <PaginaAventurasComDados dadosAventuras={respostaDadosPaginaAventuras} />
        </ContextoPaginaAventuraProvider>
    );
};