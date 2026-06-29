import { PAGINAS } from 'types-nora-api';

import { ControladorSlot } from 'Layouts/ControladorSlot';
import RedirecionadorInterno from 'Componentes/Elementos/RedirecionadorInterno/RedirecionadorInterno';
import PaginaConteudoDinamico from 'Componentes/Elementos/PaginaConteudoDinamico/page';
import { obtemDadosPorPaginaDefinicao } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export function PaginaDica_Client({ listaSlug }: { listaSlug: string[] }) {
    return (
        <ControladorSlot pagina={PAGINAS.dicas}>
            <PaginaDica_Slot listaSlug={listaSlug} />
        </ControladorSlot>
    );
};

async function PaginaDica_Slot({ listaSlug }: { listaSlug: string[] }) {
    const identificadorPagina = listaSlug.length > 0 ? `/${listaSlug.join('/')}` : '';
    const resultado = await obtemDadosPorPaginaDefinicao(identificadorPagina, 'dica');

    if (!resultado) return <RedirecionadorInterno pagina={PAGINAS.dicas} params={{ slug: [] }} />;

    return (
        <PaginaConteudoDinamico
            conteudo={resultado}
            inicio={{ pagina: PAGINAS.dicas, params: { slug: [] } }}
            listaSlug={listaSlug}
        />
    );
};
