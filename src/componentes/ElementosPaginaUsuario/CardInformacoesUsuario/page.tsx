'use client';

import styles from './styles.module.css';

import { ARQUIVOS_INTERNOS } from 'types-nora-api';

import { carregaArquivoInterno } from 'Uteis/ImagemLoader/ImagemLoader';
import RecipienteAvatar from '../RecipienteAvatar/page';
import RecipienteInfoUsuario from '../RecipienteInfoUsuario/page';

export default function CardInformacoesUsuario() {
    return (
        <div className={styles.barra_usuario} style={{ '--moldura-card-usuario': `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PERFIL_USUARIO__MOLDURA_CARD_USUARIO)}")` } as React.CSSProperties}>
            <RecipienteAvatar />
            <RecipienteInfoUsuario />
        </div>
    );
};