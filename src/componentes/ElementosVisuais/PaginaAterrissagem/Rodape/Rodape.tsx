import styles from "./styles.module.css";
import Link from 'next/link';

import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faSpotify, faYoutube, faTwitch } from "@fortawesome/free-brands-svg-icons";

export default function Rodape() {
    return (
        <div id={styles.rodape}>
            <div id={styles.recipiente_svg_rodape}>
                <ElementoSVG src={"/imagensFigma/rodape.svg"} />
            </div>
            <div id={styles.recipiente_redes_sociais}>
                <Link target='_blank' href='https://discord.universodomedo.com'><FontAwesomeIcon icon={faDiscord} /></Link>
                <Link target='_blank' href='https://open.spotify.com/show/10qzPjLpugVhzn90ufDBuN'><FontAwesomeIcon icon={faSpotify} /></Link>
                <Link target='_blank' href='https://youtube.universodomedo.com'><FontAwesomeIcon icon={faYoutube} /></Link>
                <Link target='_blank' href='https://twitch.universodomedo.com'><FontAwesomeIcon icon={faTwitch} /></Link>
            </div>
        </div>
    )
};