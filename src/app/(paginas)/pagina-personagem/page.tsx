import { ControladorSlot } from 'Layouts/ControladorSlot';

import { obtemDadosPersonagemDoUsuario } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import Redirecionador from 'Componentes/Elementos/Redirecionador/Redirecionador.tsx';
import PaginaPersonagemComDados from './page-dados.tsx';

export default function PaginaPersonagem({ params }: { params: { chave?: number } }) {
    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: true }}>
            <PaginaPersonagem_Slot params={params} />
        </ControladorSlot>
    );
};

export async function PaginaPersonagem_Slot({ params }: { params: { chave?: number } }) {
    const { chave } = await params;

    if (chave === undefined) return <Redirecionador urlRedirecionar='/meus-personagens' />;

    const respostaDadosPersonagem = await obtemDadosPersonagemDoUsuario(chave);

    if (!respostaDadosPersonagem) return <div>Erro ao carregar personagem</div>;

    return <PaginaPersonagemComDados dadosPersonagem={respostaDadosPersonagem} />;
};