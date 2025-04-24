import styles from './styles.module.css';

import { obtemPersonagensComPendencias } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';

import Link from 'next/link';

export default async function PaginaAdmin() {
    const personagens = await obtemPersonagensComPendencias();

    return (
        <>
            <Link href={'/admin/fichas-pendentes'}><h2>Fichas Pendentes - Admin [{personagens.filter(personagem => personagem.pendencias.pendenciaAdmin !== '').length}] Usuario [{personagens.filter(personagem => personagem.pendencias.pendeciaUsuario !== '').length}]</h2></Link>
            <Link href={'/admin/uploads'}><h2>Upload</h2></Link>
            <Link href={'/admin/variaveis-ambiente'}><h2>Variáveis de Ambiente</h2></Link>
        </>
    );
};