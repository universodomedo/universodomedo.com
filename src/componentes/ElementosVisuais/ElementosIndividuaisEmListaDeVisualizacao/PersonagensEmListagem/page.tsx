import { useContextoListagemPersonagens } from 'Contextos/ContextoListagemPersonagens/contexto.tsx';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import { ListaPersonagens } from './componentes.tsx';

export function PaginaListagemPersonagens_Contexto() {
    const { personagens } = useContextoListagemPersonagens();

    if (!personagens || personagens.length < 1) return <div>Erro ao carregar Personagens</div>;

    if (personagens.length < 1) return (
        <div>
            <h2>Nenhum Personagem foi encontrado</h2>
            <CustomLink href={'/dicas/criando-um-novo-personagem'} target='_blank'><h2>Maiores informações sobre o Cadastro de Personagens</h2></CustomLink>
        </div>
    );

    return <ListaPersonagens />
};