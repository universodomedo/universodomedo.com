import styles from './styles.module.css'

import { ARQUIVOS_INTERNOS } from 'types-nora-api';

import TituloSecao from 'Componentes/ElementosVisuais/TituloSecao/TituloSecao';
import RecipienteArquivoInterno from 'Uteis/ImagemLoader/RecipienteArquivoInterno';
import { carregaArquivoInterno } from 'Uteis/ImagemLoader/ImagemLoader';

export default function PaginaAterrissagem_SecaoTutorial() {
    return (
        <div className={styles.recipiente_secao_tutorial}>
             <TituloSecao primeiraLetra='T' corpo='UTORIA' ultimaLetra='L'/>

            <div className={styles.recipiente_card_missao}>
                <div className={styles.recipiente_card_tutorial}>
                    <div className={styles.recipiente_textos_tutorial}>
                        <h2 className={styles.titulo_missao}>#1  <span className={styles.strong_titulo} >M</span>ISSÃO</h2>

                        <p className={styles.paragrafo_missao}>O Universo do Medo está em constante movimento. Assim como suas ações moldam o mundo, ele também molda seus personagens — afetando decisões, relações e até a forma como o medo se manifesta.</p>

                        <a className={styles.recipiente_botao_card} href="">
                            <p className={styles.texto_botao_card} ><span className={styles.strong}>A</span>CEITA<span className={styles.strong}>R</span></p>
                            <RecipienteArquivoInterno arquivo={'PAGINA_ATERRISSAGEM__BOTAO_MISSAO'} className={styles.botao_card}/>
                        </a>
                    </div>

                    <div className={styles.recipiente_fundo_card} style={{ ['--moldura' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PAGINA_ATERRISSAGEM__MOLDURA_MISSAO)}")`, ['--ornamento' as never]: `url("${carregaArquivoInterno(ARQUIVOS_INTERNOS.PAGINA_ATERRISSAGEM__ORNAMENTO_MISSAO)}")` }}>
                        <RecipienteArquivoInterno arquivo={'PAGINA_ATERRISSAGEM__FUNDO_MISSAO'} className={styles.fundo_card}/>
                    </div>
                </div>

            </div>

            <div className={styles.recipiente_background_tinta}>
                <RecipienteArquivoInterno arquivo={'PAGINA_ATERRISSAGEM__EXTERNO_MISSAO'}/>
            </div>
        </div>
    );
};