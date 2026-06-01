import styles from './styles.module.css';

import { useContexto__PaginaPerfilUsuario } from '@/contextos/Contexto__PaginaPerfilUsuario/contexto';
import { Recipiente__Contexto__Modal__ConfiguradorArteCapa__Provider, type ConfiguracaoArteCapa } from '@/contextos/Contexto__Modal__ConfiguradorArteCapa/contexto';
import { RenderArquivoArteCapa } from '@/uteis/RenderArquivoTipados/RenderArquivoTipados';

export default function CapaUsuario({ configArteCapa }: { configArteCapa?: ConfiguracaoArteCapa; }) {
    const { registroUsuario } = useContexto__PaginaPerfilUsuario();

    return (
        <div className={styles.capa_usuario}>
            {configArteCapa && <Recipiente__Contexto__Modal__ConfiguradorArteCapa__Provider configArteCapa={configArteCapa} />}
            <div className={styles.filtro_capa} />
            <div className={styles.imagem_capa}>
                <RenderArquivoArteCapa caminhoArquivoArte={registroUsuario.arteCapaPerfil.caminhoArquivoArteCapa} />
            </div>
        </div>
    );
};