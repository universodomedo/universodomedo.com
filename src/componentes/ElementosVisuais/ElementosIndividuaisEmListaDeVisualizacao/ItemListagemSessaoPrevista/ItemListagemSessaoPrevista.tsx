import styles from './styles.module.css';

import { SessaoEmVisualizacaoDto } from 'types-nora-api';

import RecipienteImagem from 'Uteis/ImagemLoader/RecipienteImagem';
import { formataData } from 'Uteis/FormatadorDeDatas/FormatadorDeDatas';

export default function ItemListagemSessaoPrevista({ sessao }: { sessao: SessaoEmVisualizacaoDto }) {
    return (
        <div className={styles.recipiente_item_episodio_futuro}>
            <div className={styles.recipiente_capa_item_episodio_futuro}>
                <RecipienteImagem src={sessao.imagemCapa.caminhoCapa} />
            </div>
            <div className={styles.recipiente_informacaoes_item_episodio_futuro}>
                <h2>{sessao.tituloInteligente.titulo}</h2>
                {sessao.tituloInteligente.subtitulo && (<h4>{sessao.tituloInteligente.subtitulo}</h4>)}
                <h3>{formataData(sessao.dataPrevisaoInicio)}</h3>
            </div>
        </div>
    );
};