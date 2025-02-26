'use client'; // Indica que este é um componente do lado do cliente

import { useQuery } from '@tanstack/react-query';
import { CarregaInformacoesIniciais } from 'Servicos/CarregaInformacoesIniciais';
import ListaOpcoes from 'Componentes/PaginasGenericas/ListaOpcoes'

type DefinicaoDinamicaClientProps = {
    tipo: string;
};

export default function DefinicaoDinamicaClient({ tipo }: DefinicaoDinamicaClientProps) {
    // Usa o hook useQuery para acessar os dados de todas as entidades
    const { data, isLoading, error } = useQuery({
        queryKey: ['allEntities'], // Chave da query
        queryFn: CarregaInformacoesIniciais,  // Função de carregamento
    });
    
    if (isLoading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>Erro ao carregar os dados.</div>;
    }

    let dados;
    switch (tipo) {
        case 'atributos':
            dados = data?.atributos;
            break;
        case 'pericias':
            dados = data?.pericias;
            break;
        // Adicione mais casos conforme necessário
        default:
            dados = null;
    }

    if (!dados) {
        return <div>Definição não encontrada.</div>;
    }

    // Se for uma lista, exibe as opções
    return <ListaOpcoes tipo={tipo} dados={dados} />;
}