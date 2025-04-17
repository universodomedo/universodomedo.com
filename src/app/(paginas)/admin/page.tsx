import styles from './styles.module.css';

import Link from 'next/link';

export default function PaginaAdmin() {
    return (
        <>
            <Link href={'/admin/uploads'}><h2>Upload</h2></Link>
            <Link href={'/admin/variaveis-ambiente'}><h2>Variáveis de Ambiente</h2></Link>
        </>
    );
};