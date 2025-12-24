import { ControladorSlot } from 'Layouts/ControladorSlot';
import { PAGINAS } from 'types-nora-api';
import Redirecionador from 'Componentes/Elementos/Redirecionador/Redirecionador.tsx';
import PaginaConteudoDinamico from 'Componentes/Elementos/PaginaConteudoDinamico/page';
import { obtemDadosPorPaginaDefinicao } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export default async function PaginaDefinicao({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const listaSlug = slug || [];

    return (
        <ControladorSlot pagina={PAGINAS.definicoes}>
            <PaginaDefinicao_Slot listaSlug={listaSlug} />
        </ControladorSlot>
    );
}

async function PaginaDefinicao_Slot({ listaSlug }: { listaSlug: string[] }) {
    const identificadorPagina = listaSlug.length > 0 ? `/${listaSlug.join('/')}` : '';
    const resultado = await obtemDadosPorPaginaDefinicao(identificadorPagina);

    if (!resultado) return <Redirecionador pagina={PAGINAS.definicoes} params={{ slug: [] }} />;

    return (
        <PaginaConteudoDinamico
            conteudo={resultado}
            inicio={{ pagina: PAGINAS.definicoes, params: { slug: [] } }}
            listaSlug={listaSlug}
        />
    );
};