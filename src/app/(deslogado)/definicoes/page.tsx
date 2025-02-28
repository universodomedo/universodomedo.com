import styles from './styles.module.css';

import Link from 'next/link';

export default function DefinicoesPage() {
    const definicoes = [
        { tipo: 'atributos', nome: 'Atributos' },
        { tipo: 'pericias', nome: 'Pericias' },
    ];

    return (
        <>
            <h1 style={{fontSize:'4rem', margin: 'auto'}}>Definições</h1>

            <div style={{display:'flex', flexDirection: 'row', width: '60%' }}>
                {definicoes.map((def, index) => (
                    <div key={index} style={{ display: 'flex', flex: '1 0 0', alignContent: 'center', justifyContent: 'center' }}>
                        <p style={{ fontSize: '2rem' }}>
                            <Link href={`/definicoes/${def.tipo}`}>
                                {def.nome}
                            </Link>
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
}