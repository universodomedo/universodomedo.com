import styles from './styles.module.css';

import { useEffect, useState } from 'react';

import { useContextoSalaDeJogo__Jogador } from 'Contextos/ContextoSalaDeJogo__Jogador/contexto';
import { RenderArquivoAvatar } from 'Uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function SwiperDireita({ children }: { children: React.ReactNode; }) {
    const { caminhoAvatar, resultadoMissaoFuncional } = useContextoSalaDeJogo__Jogador();

    const [swiperDireitaAberto, setSwiperDireitaAberto] = useState(false);

    const alternaSwiperDireitaAberto = () => setSwiperDireitaAberto(!swiperDireitaAberto);

    // Ao lançar a Vitória (resultado != null), recolhe o Swiper para não cobrir a modal de finalização. Reabertura manual segue livre pelo botão.
    useEffect(() => { if (resultadoMissaoFuncional !== null) setSwiperDireitaAberto(false); }, [resultadoMissaoFuncional]);
    
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