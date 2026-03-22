'use client';

import styles from './styles.module.css';

import { ArquivoCompletaDto } from "types-nora-api";

import RecipienteImagemPadrao from 'Uteis/ImagemLoader/RecipienteImagemPadrao';
import RecipienteAviso from '../RecipienteAviso/RecipienteAviso';


export default function ImagemPendente({ arquivoPendente }: { arquivoPendente: ArquivoCompletaDto }) {
    return (
        <>
            <div className={styles.recipiente_visualizador_imagem}>
                <RecipienteImagemPadrao src={arquivoPendente.caminhoArquivo} />
            </div>

            <RecipienteAviso tipo='negativo'>
                <h2>Atenção!</h2>

                <p>Você possui uma imagem pendente de aprovação</p>
                <p>Você será notificado quando não tiver mais pendências para então seguir com a adição de novas imagens</p>
            </RecipienteAviso>
        </>
    );
};