'use client';

import styles from './styles.module.css';

import { type ConfiguracaoArteCapa } from '@/contextos/Contexto__Modal__ConfiguradorArteCapa/contexto';
import CapaUsuario from '../CapaUsuario/page';
import CardInformacoesUsuario from '../CardInformacoesUsuario/page';

export default function CardCapaUsuario({ configArteCapa }: { configArteCapa?: ConfiguracaoArteCapa; }) {
    return (
        <div className={styles.recipiente_card_usuario}>
            <h2 /> {/* ta aqui para manter o espaço, TO DO */}
            <CapaUsuario configArteCapa={configArteCapa} />
            <CardInformacoesUsuario />
        </div>
    );
};