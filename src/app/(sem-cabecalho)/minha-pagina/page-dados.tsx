'use client';

import styles from './styles.module.css';

import BarraUsuario from 'Componentes/ElementosPaginaUsuario/BarraUsuario/page.tsx';
import SecaoPosts from 'Componentes/ElementosPaginaUsuario/Post/page.tsx';
import SecaoContatos from 'Componentes/ElementosPaginaUsuario/Contato/page.tsx';

import { UsuarioDto } from 'types-nora-api';

export default function MinhaDisponibilidadeComDados({ dadosMinhaPagina }: { dadosMinhaPagina: UsuarioDto }) {
    return (
        <div id={styles.portal_usuario}>
            <div id={styles.portal_usuario_esquerda}>
                <BarraUsuario dadosMinhaPagina={dadosMinhaPagina!} />
                <SecaoPosts />
            </div>

            {<SecaoContatos />}
        </div>
    );
}