'use client';

import styles from './styles.module.css';

import ModalPrimeiroAcesso from "Componentes/ElementosDeJogo/ModalPrimeiroAcesso/page";
import BarraUsuario from 'Componentes/ElementosPaginaUsuario/BarraUsuario/page.tsx';
import Post from 'Componentes/ElementosPaginaUsuario/Post/page.tsx';
import Contato from 'Componentes/ElementosPaginaUsuario/Contato/page.tsx';

import { DadosMinhaPagina } from 'types-nora-api';

export default function MinhaDisponibilidadeComDados({ dadosMinhaPagina }: { dadosMinhaPagina: DadosMinhaPagina }) {
    if (dadosMinhaPagina?.username === null) {
        return (
            <ModalPrimeiroAcesso />
        );
    }

    return (
        <div id={styles.portal_usuario}>
            <div id={styles.portal_usuario_esquerda}>
                <BarraUsuario dadosMinhaPagina={dadosMinhaPagina!} />

                <SecaoPosts />
            </div>

            <SecaoContatos />
        </div>
    );
};

function SecaoPosts() {
    return (
        <div id={styles.recipiente_lista_posts}>
            {/* <Post /> */}
            <h1>Nenhuma postagem encontrada</h1>
        </div>
    );
};

function SecaoContatos() {
    return (
        <div id={styles.portal_usuario_direita}>
            <div className={styles.secao_contatos}>
                {/* <div className={styles.topo_secao_contatos}><h2>Usuários Conectados - 2</h2></div>
                <div className={styles.recipiente_lista_contatos}>
                    <Contato />
                    <Contato />
                </div> */}
                <div className={styles.topo_secao_contatos}><h2>Usuários Conectados - 0</h2></div>
            </div>
            <div className={styles.secao_contatos}>
                {/* <div className={styles.topo_secao_contatos}><h2>Usuários Desconectados - 1</h2></div>
                <div className={styles.recipiente_lista_contatos}>
                    <Contato />
                </div> */}
                <div className={styles.topo_secao_contatos}><h2>Usuários Desconectados - 0</h2></div>
            </div>
        </div>
    );
};