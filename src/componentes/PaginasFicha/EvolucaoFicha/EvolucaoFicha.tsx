import RecipienteEdicaoFicha from 'Contextos/ContextoEdicaoFicha/contexto';
import { useContextoPaginaPersonagens } from 'Contextos/ContextoPaginaPersonagens/contexto';

export default function EvolucaoFicha() {
    const { personagemSelecionado } = useContextoPaginaPersonagens();

    return (
        <RecipienteEdicaoFicha personagemSelecionado={personagemSelecionado!} />
    );
};