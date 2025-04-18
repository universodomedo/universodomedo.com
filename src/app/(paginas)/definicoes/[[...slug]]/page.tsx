import { ControladorSlot } from 'Layouts/ControladorSlot';
import Redirecionador from 'Componentes/Elementos/Redirecionador/Redirecionador.tsx';

import PaginaConteudoDinamico from 'Componentes/Elementos/PaginaConteudoDinamico/page';
import { obtemDadosPorPaginaDefinicao } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export default async function PaginaDefinicao({ params }: { params: Promise<{ slug: string[] }>; }) {
    const { slug } = await params;
    const listaSlug = slug || [];

    return (
        <ControladorSlot pageConfig={{ comCabecalho: true, usuarioObrigatorio: false }}>
            <PaginaDefinicao_Slot listaSlug={listaSlug} />
        </ControladorSlot>
    );
}

async function PaginaDefinicao_Slot({ listaSlug }: { listaSlug: string[] }) {
    const identificadorPagina = listaSlug.length > 0 ? `/${listaSlug.join("/")}` : "";
    const resultado = await obtemDadosPorPaginaDefinicao(identificadorPagina);

    if (!resultado) return <Redirecionador urlRedirecionar='/definicoes' />

    return <PaginaConteudoDinamico conteudo={resultado} listaSlug={listaSlug} />;
};