import styles from './styles.module.css';

import { useState } from 'react';

import { useContextoSalaDeJogo__Jogador } from 'Contextos/ContextoSalaDeJogo__Jogador/contexto';
import { RenderArquivoAvatar } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function SwiperDireita({ children }: { children: React.ReactNode; }) {
    const { caminhoAvatar } = useContextoSalaDeJogo__Jogador();

    const [swiperDireitaAberto, setSwiperDireitaAberto] = useState(false);
    
    const alternaSwiperDireitaAberto = () => setSwiperDireitaAberto(!swiperDireitaAberto);
    
    return (
        <div className={`${styles.swiper_direita} ${!swiperDireitaAberto ? styles.swiper_direita_fechado : ''}`}>
            <button onClick={alternaSwiperDireitaAberto} className={styles.botao_swiper_direita}>
                <RenderArquivoAvatar caminhoArquivoAvatar={caminhoAvatar} />
            </button>
            <div className={styles.recipiente_conteudo_swiper_direita}>
                {children}
            </div>
        </div>
    );
};