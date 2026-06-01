'use client';

import styles from './styles.module.css';

import { ARQUIVOS_INTERNOS } from 'types-nora-api';

import { type ConfiguracaoArteCapa } from '@/contextos/Contexto__Modal__ConfiguradorArteCapa/contexto';
import { carregaArquivoInterno } from 'Uteis/ImagemLoader/ImagemLoader.ts';
import CardCapaUsuario from '../CardCapaUsuario/page.tsx';
import EmblemaConquistas from '../EmblemaConquistas/page.tsx';

export default function BarraUsuario({ configArteCapa }: { configArteCapa?: ConfiguracaoArteCapa; }) {
    return (
        <div className={styles.recipiente_perfil}>
            <div className={styles.recipiente_barra_usuario} style={{ ['--moldura' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PERFIL_USUARIO__MOLDURA_SECAO_USUARIO)}")` }}>
                <CardCapaUsuario configArteCapa={configArteCapa} />
                <EmblemaConquistas />
            </div>
        </div>
    );
};