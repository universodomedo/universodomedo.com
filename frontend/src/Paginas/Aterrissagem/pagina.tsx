// #region Imports
import style from './style.module.css';

import SecaoInicial from 'Paginas/Aterrissagem/Secoes/SecaoInicial/pagina.tsx'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faSpotify, faYoutube, faTwitch } from "@fortawesome/free-brands-svg-icons";
// #endregion

const PaginaAterrissagem = () => {
  const Corpo = () => {
    return (
      <div id={style.corpo}>
        <SecaoInicial />
      </div>
    );
  }

  const Rodape = () => {
    return (
      <div id={style.rodape}>
        <div className={`${style.quinas_rodape} ${style.quina_rodape_esquerda}`}></div>
        <div id={style.meio_rodape}>
          <ul id={style.rodape_icones_redes_sociais}>
            <li><a target="_blank" href="https://discord.universodomedo.com"><FontAwesomeIcon icon={faDiscord} /></a></li>
            <li><a target="_blank" href="https://open.spotify.com/show/10qzPjLpugVhzn90ufDBuN"><FontAwesomeIcon icon={faSpotify} /></a></li>
            <li><a target="_blank" href="https://youtube.universodomedo.com"><FontAwesomeIcon icon={faYoutube} /></a></li>
            <li><a target="_blank" href="https://twitch.universodomedo.com"><FontAwesomeIcon icon={faTwitch} /></a></li>
          </ul>
        </div>
        <div className={`${style.quinas_rodape} ${style.quina_rodape_direita}`}></div>
      </div>
    )
  }

  return (
    <>
      <Corpo />
      <Rodape />
    </>
  )
}

export default PaginaAterrissagem;