import styles from './styles.module.css'
import TituloSecao from 'Componentes/ElementosVisuais/TituloSecao/TituloSecao';

export default function MissaoTutorial() {
    return (
        <div className={styles.recipiente_secao_tutorial}>
            
             <TituloSecao primeiraLetra='T' corpo='UTORIA' ultimaLetra='L'/>

            <div className={styles.recipiente_card_missao}>

                <div className={styles.recipiente_card_tutorial}>


                    <div className={styles.recipiente_textos_tutorial}>

                        <h2 className={styles.titulo_missao}>
                            #1  <span className={styles.strong_titulo} >M</span>ISSÃO
                        </h2>

                        <p className={styles.paragrafo_missao}>
                            O Universo do Medo está em constante movimento. Assim como suas ações moldam o mundo, ele também molda seus personagens — afetando decisões, relações e até a forma como o medo se manifesta.
                        </p>

                        <a className={styles.recipiente_botao_card} href="">
                            <p className={styles.texto_botao_card} ><span className={styles.strong}>A</span>CEITA<span className={styles.strong}>R</span></p>
                            <img src="/imagensFigma/botao-tutorial.webp" alt="" className={styles.botao_card} />
                        </a>
                    </div>

                    <div className={styles.recipiente_fundo_card}>
                        <img src="/imagensFigma/card-missoes.webp" alt="#" className={styles.fundo_card} />
                    </div>
                </div>

            </div>

            <div className={styles.recipiente_background_tinta}>
                <img src="/imagensFigma/background-missoes.webp" alt="#" />
            </div>
        </div>
    )
}