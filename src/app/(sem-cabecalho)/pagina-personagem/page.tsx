import { obtemDadosPersonagemDoUsuario } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import Redirecionador from 'Componentes/Elementos/Redirecionador/Redirecionador.tsx';
import PaginaPersonagemComDados from './page-dados.tsx';

export default async function PaginaPersonagem({ params }: { params: { chave?: number } }) {
    const { chave } = await params;

    if (chave === undefined) return <Redirecionador urlRedirecionar='/meus-personagens' />;

    const respostaDadosPersonagem = await obtemDadosPersonagemDoUsuario(chave);

    if (!respostaDadosPersonagem.sucesso || !respostaDadosPersonagem.dados) return <div>Erro ao carregar personagem</div>;

    return <PaginaPersonagemComDados dadosPersonagem={respostaDadosPersonagem.dados} />
};