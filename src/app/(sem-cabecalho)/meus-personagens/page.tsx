import { obtemDadosPaginaPersonagens } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import PaginaPersonagensComDados from './page-dados.tsx';

export default async function PaginaMeusPersonagens() {
    const respostaDadosPaginaPersonagens = await obtemDadosPaginaPersonagens();

    if (!respostaDadosPaginaPersonagens.sucesso || !respostaDadosPaginaPersonagens.dados) return <div>Erro ao carregar personagens</div>;

    return <PaginaPersonagensComDados dadosPersonagens={respostaDadosPaginaPersonagens.dados} />
};