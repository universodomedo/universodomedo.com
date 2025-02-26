'use client'; // Indica que este é um componente do lado do cliente

import { useQuery } from '@tanstack/react-query';
import { CarregaInformacoesIniciais } from 'Servicos/CarregaInformacoesIniciais';
import DefinicaoGenerica from 'Componentes/PaginasGenericas/DefinicaoGenerica';

type DefinicaoEspecificaClientProps = {
    tipo: string;
    id: string;
};

export default function DefinicaoEspecificaClient({ tipo, id }: DefinicaoEspecificaClientProps) {
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

    // Verifica o tipo e obtém os dados correspondentes
    let dados;
    if (tipo === 'atributos') {
        dados = data?.atributos.find((atr: any) => atr.id === parseInt(id));
    } else if (tipo === 'pericias') {
        dados = data?.pericias.find((per: any) => per.id === parseInt(id));
    }

    if (!dados) {
        return <div>Definição não encontrada.</div>;
    }

    // Exibe a definição específica
    return <DefinicaoGenerica tipo={tipo} dados={dados} />;
}