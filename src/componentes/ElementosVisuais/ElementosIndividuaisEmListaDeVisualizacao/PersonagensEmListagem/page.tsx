import { useContextoListagemPersonagens } from 'Contextos/ContextoListagemPersonagens/contexto.tsx';
import { PaginaPersonagemSelecionado } from './componentes/pagina-personagem.tsx';
import { PaginaListaPersonagens } from './componentes/pagina-todos-personagens.tsx';

export function PaginaListagemPersonagens_Contexto() {
    const { personagemSelecionado } = useContextoListagemPersonagens();

    return !personagemSelecionado
        ? <PaginaListaPersonagens />
        : <PaginaPersonagemSelecionado />
};