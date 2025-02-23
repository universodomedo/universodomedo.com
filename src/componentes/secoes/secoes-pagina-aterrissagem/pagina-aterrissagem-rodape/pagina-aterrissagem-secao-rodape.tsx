import styles from "./styles.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faSpotify, faYoutube, faTwitch } from "@fortawesome/free-brands-svg-icons";

export default function Rodape() {
    return (
        <div id={styles.rodape}>
            <div className={`${styles.quinas_rodape} ${styles.quina_rodape_esquerda}`}></div>
            <div id={styles.meio_rodape}>
                <ul id={styles.rodape_icones_redes_sociais}>
                    <li><a target="_blank" href="https://discord.universodomedo.com"><FontAwesomeIcon icon={faDiscord} /></a></li>
                    <li><a target="_blank" href="https://open.spotify.com/show/10qzPjLpugVhzn90ufDBuN"><FontAwesomeIcon icon={faSpotify} /></a></li>
                    <li><a target="_blank" href="https://youtube.universodomedo.com"><FontAwesomeIcon icon={faYoutube} /></a></li>
                    <li><a target="_blank" href="https://twitch.universodomedo.com"><FontAwesomeIcon icon={faTwitch} /></a></li>
                </ul>
            </div>
            <div className={`${styles.quinas_rodape} ${styles.quina_rodape_direita}`}></div>
        </div>
    )
};