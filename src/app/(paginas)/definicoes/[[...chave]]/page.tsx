import { ControladorSlot } from 'Layouts/ControladorSlot';
import Redirecionador from 'Componentes/Elementos/Redirecionador/Redirecionador.tsx';

import PaginaConteudoDinamico from 'Componentes/Elementos/PaginaConteudoDinamico/page';
import { obtemDadosPorPaginaDefinicao } from 'Uteis/ApiConsumer/ConsumerMiddleware';

export default function PaginaAcessar({ params }: { params: { chave?: string[] } }) {
    return (
        <ControladorSlot pageConfig={{ comCabecalho: true, usuarioObrigatorio: false }}>
            <PaginaDefinicao params={params}/>
        </ControladorSlot>
    );
};

export async function PaginaDefinicao({ params }: { params: { chave?: string[] } }) {
    const { chave } = await params;
    const listaChaves = chave || [];

    const identificadorPagina = listaChaves.length > 0 ? `/${listaChaves.join("/")}` : "";
    const resultado = await obtemDadosPorPaginaDefinicao(identificadorPagina);

    if (!resultado) return <Redirecionador urlRedirecionar='/definicoes' />

    return <PaginaConteudoDinamico conteudo={resultado} listaChaves={listaChaves} />;
};