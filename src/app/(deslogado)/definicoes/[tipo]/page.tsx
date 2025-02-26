import DefinicaoDinamicaClient from 'App/(deslogado)/definicoes/[tipo]/DefinicaoDinamicaClient.tsx';

type Props = {
    params: {
        tipo: string;
    };
};

export default function DefinicaoDinamica({ params }: Props) {
    const { tipo } = params;

    return <DefinicaoDinamicaClient tipo={tipo} />;
}