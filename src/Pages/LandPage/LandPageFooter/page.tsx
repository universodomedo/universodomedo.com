import "./style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faSpotify, faYoutube, faTwitch } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  return (
    <div className='footer'>
      <div className='footer-end'>
        <div className="curved-corners left"></div>
        <div className="social-media">
          <ul className="social-icons">
            <li><a target="_blank" href="https://discord.universodomedo.com"><FontAwesomeIcon icon={faDiscord} /></a></li>
            <li><a target="_blank" href="https://open.spotify.com/show/10qzPjLpugVhzn90ufDBuN"><FontAwesomeIcon icon={faSpotify} /></a></li>
            <li><a target="_blank" href="https://youtube.universodomedo.com"><FontAwesomeIcon icon={faYoutube} /></a></li>
            <li><a target="_blank" href="https://twitch.universodomedo.com"><FontAwesomeIcon icon={faTwitch} /></a></li>
          </ul>
        </div>
        <div className="curved-corners right"></div>
      </div>
    </div>
  )
}

export default Footer;