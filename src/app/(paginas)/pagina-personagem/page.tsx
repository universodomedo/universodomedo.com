import { ControladorSlot } from 'Layouts/ControladorSlot';

import { obtemDadosPersonagemDoUsuario } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import Redirecionador from 'Componentes/Elementos/Redirecionador/Redirecionador.tsx';
import PaginaPersonagemComDados from './page-dados.tsx';

export default async function PaginaPersonagem({ params }: { params: Promise<{ slug?: number }>; }) {
    const { slug } = await params;

    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: true }}>
            <PaginaPersonagem_Slot slug={slug} />
        </ControladorSlot>
    );
};

async function PaginaPersonagem_Slot({ slug }: { slug?: number }) {
    if (slug === undefined) return <Redirecionador urlRedirecionar='/meus-personagens' />;

    const respostaDadosPersonagem = await obtemDadosPersonagemDoUsuario(slug);

    if (!respostaDadosPersonagem) return <div>Erro ao carregar personagem</div>;

    return <PaginaPersonagemComDados dadosPersonagem={respostaDadosPersonagem} />;
};