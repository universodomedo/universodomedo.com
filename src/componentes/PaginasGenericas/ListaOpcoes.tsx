import Link from 'next/link';

type ListaOpcoesProps = {
    tipo: string;
    dados: any[];
};

export default function ListaOpcoes({ tipo, dados }: ListaOpcoesProps) {
    return (
        <div>
            <h1>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h1>
            <ul>
                {dados.map(item => (
                    <li key={item.id}>
                        <Link href={`/definicoes/${tipo}/${item.id}`}>
                            {item.nome}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}