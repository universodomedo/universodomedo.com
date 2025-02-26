import { use } from 'react';
import DefinicaoEspecificaClient from 'App/(deslogado)/definicoes/[tipo]/[id]/DefinicaoEspecificaClient.tsx';

type Props = {
    params: {
        tipo: string;
        id: string;
    };
};

export default function DefinicaoEspecifica({ params }: Props) {
    const { tipo, id } = params;

    // Passa `tipo` e `id` para o Client Component
    return <DefinicaoEspecificaClient tipo={tipo} id={id} />;
}