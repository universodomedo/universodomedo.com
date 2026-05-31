'use client';

import styles from './styles.module.css';

import { ARQUIVOS_INTERNOS } from 'types-nora-api';

import { carregaArquivoInterno } from 'Uteis/ImagemLoader/ImagemLoader.ts';
import CardCapaUsuario from '../CardCapaUsuario/page.tsx';
import EmblemaConquistas from '../EmblemaConquistas/page.tsx';

export default function BarraUsuario() {
    return (
        <div className={styles.recipiente_perfil}>
            <div className={styles.recipiente_barra_usuario} style={{ ['--moldura' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PERFIL_USUARIO__MOLDURA_SECAO_USUARIO)}")` }}>
                <CardCapaUsuario />
                <EmblemaConquistas />
            </div>
        </div>
    );
};