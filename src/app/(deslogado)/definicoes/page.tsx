import styles from './styles.module.css';

import Link from 'next/link';

export default function DefinicoesPage() {
    const definicoes = [
        { tipo: 'atributos', nome: 'Atributos' },
        { tipo: 'pericias', nome: 'Pericias' },
    ];

    return (
        <div>
            <h1>Definições</h1>
            <ul>
                {definicoes.map(def => (
                    <li key={def.tipo}>
                        <Link href={`/definicoes/${def.tipo}`}>
                            {def.nome}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}