import PaginaConteudoDinamico from 'Componentes/Elementos/PaginaConteudoDinamico/page';
import Redirecionador from 'Componentes/Elementos/Redirecionador/Redirecionador.tsx';
import { obtemDadosPorPaginaDefinicao } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export default async function PaginaDefinicao({ params }: { params: { chave?: string[] } }) {
    const { chave } = await params;
    const listaChaves = chave || [];

    const identificadorPagina = listaChaves.length > 0 ? `/${listaChaves.join("/")}` : "";
    const resultado = await obtemDadosPorPaginaDefinicao(identificadorPagina);

    if (!resultado.sucesso || resultado.dados === undefined) {
        return (
            <Redirecionador urlRedirecionar='/definicoes' />
        );
    }

    const conteudo = resultado.dados;

    return <PaginaConteudoDinamico conteudo={conteudo} listaChaves={listaChaves} />
};