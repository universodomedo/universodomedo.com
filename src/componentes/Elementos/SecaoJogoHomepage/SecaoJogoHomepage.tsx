import { functionsIn } from 'lodash'
import styles from './styles.module.css'
import ArtigoCarrossel from '../ArtigoCarrossel/ArtigoCarrossel';

export default function SecaoJogoHomepage() {

    return (

        <div className={styles.recipiente_secao_jogo}>
            <div className={styles.recipiente_artigos}>


                <ConteudoArtigoUm />

                <h2 className={styles.titulo_jogo}><span className={styles.cinzel_decorative}>O</span> JO<span className={styles.cinzel_decorative}>G</span>O</h2>

                <ArtigoCarrossel />

            </div>

        </div>
    )

    function ConteudoArtigoUm() {
        
        return <div className={styles.recipiente_artigo_um}>

            <div className={styles.moldura_tinta}>
                <div className={styles.bg_fixed} />
            </div>

            <div className={styles.paragrafos_artigo_um}>
                <p><span className={styles.texto_decorado}>U</span><strong className={styles.strong}>niverso do Medo</strong> é um RPG ambientado em um mundo onde o paranormal não é uma lenda, mas uma força silenciosa que se infiltra na realidade. Fenômenos inexplicáveis, entidades ocultas e segredos antigos moldam a história — muitas vezes longe dos olhos da maioria das pessoas.</p>
                <p>Aqui, os jogadores assumem o papel de indivíduos comuns — ou quase — diante do desconhecido. Investigando mistérios, enfrentando o medo e tomando decisões que podem alterar não apenas suas próprias histórias, mas o curso da humanidade.</p>
                <p>O Universo do Medo propõe uma nova forma de viver o RPG de mesa: mais imersiva, contínua e conectada. Cada escolha importa, cada ação deixa marcas, e o que acontece em uma mesa ecoa além dela. Este não é apenas um jogo para ser jogado. É um universo para ser explorado, enfrentado — e, para alguns, transformado.</p>
            </div>

        </div>;
    }
}