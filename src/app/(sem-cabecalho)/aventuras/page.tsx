import { obtemDadosPaginaAventuras } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import PaginaAventurasComDados from './page-dados.tsx';

export default async function PaginaAventuras() {
    const respostaDadosPaginaAventuras = await obtemDadosPaginaAventuras();

    if (!respostaDadosPaginaAventuras.sucesso || !respostaDadosPaginaAventuras.dados) return <div>Erro ao carregar aventuras</div>;

    return <PaginaAventurasComDados dadosAventuras={respostaDadosPaginaAventuras.dados} />
};