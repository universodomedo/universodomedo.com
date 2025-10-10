import styles from './styles.module.css';

import { obtemPersonagensComPendencias } from 'Uteis/ApiConsumer/ConsumerMiddleware.tsx';
import Link from 'next/link';

export function ListaAcoesAdmin() {
    // const personagens = await obtemPersonagensComPendencias();

    return (
        <div id={styles.recipiente_lista_acoes_admin}>
            {/* antes tinha um outro objetinho, mas ainda tem q servir como verificador */}
            {/* <Link href={'/admin/fichas-pendentes'}><h2>Fichas Pendentes - Admin [{personagens.filter(personagem => personagem.pendencias.pendenciaAdmin !== '').length}] Usuario [{personagens.filter(personagem => personagem.pendencias.pendeciaUsuario !== '').length}]</h2></Link> */}
            <Link href={'/minhas-paginas/admin/uploads'}><h2>Upload</h2></Link>
            <Link href={'/minhas-paginas/admin/variaveis-ambiente'}><h2>Variáveis de Ambiente</h2></Link>
            <Link href={'/minhas-paginas/admin/aventuras'}><h2>Aventuras</h2></Link>
            <Link href={'/minhas-paginas/admin/dashboard-aovivo'}><h2>Dashboard Aovivo</h2></Link>
        </div>
    );
}