import { MENUS_INTERNOS } from 'types-nora-api';
import styles from './styles.module.css';

import Link from 'next/link';

export default function ListaAcoesAdmin() {

    return (
        <div id={styles.recipiente_lista_acoes_admin}>
            <Link href={'/minhas-paginas/admin/uploads'}><h2>Upload</h2></Link>
            <Link href={'/minhas-paginas/admin/variaveis-ambiente'}><h2>Variáveis de Ambiente</h2></Link>
            <Link href={'/minhas-paginas/admin/aventuras'}><h2>Aventuras</h2></Link>
            <Link href={'/minhas-paginas/admin/dashboard-ws'}><h2>Dashboard WebSocket</h2></Link>
        </div>
    );
};