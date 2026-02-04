import { useContextoListagemPersonagens } from 'Contextos/ContextoListagemPersonagens/contexto.tsx';
import CustomLink from 'Componentes/Elementos/CustomLink/CustomLink';
import { ListaPersonagens } from './componentes.tsx';

export function PaginaListagemPersonagens_Contexto() {
    const { personagens } = useContextoListagemPersonagens();

    return personagens.length < 1
        ? <div>
            <h2>Nenhum Personagem foi encontrado</h2>
            {/* slug não criado */}
            {/* <CustomLink href={'/dicas/criando-um-novo-personagem'} target='_blank'><h2>Maiores informações sobre o Cadastro de Personagens</h2></CustomLink> */}
        </div>
        : <ListaPersonagens />;
};