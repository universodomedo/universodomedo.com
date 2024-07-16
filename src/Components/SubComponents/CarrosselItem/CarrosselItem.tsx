import "./CarrosselItem.css";
import { Link } from "react-router-dom";

const CarrosselItem = ({ idSession, itemTitle, imgUrl, tsStart, live }: { idSession: number, itemTitle: string, imgUrl: string, tsStart: Date, live: boolean }) => {
  const getTimeRemaining = ():string => {
    const now = new Date();

    const difference = tsStart.getTime() - now.getTime();

    const prefix = 'Próxima Sessão em ';

    if (difference >= 86400000) {
      const days = Math.floor(difference / 86400000);
      return `${prefix}${days} dia${days > 1 ? 's' : ''}`;
    } else if (difference >= 3600000) {
      const hours = Math.floor(difference / 3600000);
      return `${prefix}${hours} hora${hours > 1 ? 's' : ''}`;
    } else if (difference >= 60000) {
      const minutes = Math.floor(difference / 60000);
      return `${prefix}${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else {
      return "Sessão Iniciando...";
    }
  };

  return (
    <Link to={`/session/${idSession}`}>
      <div className="retanguloCarrossel">
        <img className='imgRetanguloCarroussel' src={imgUrl} alt="" />
        <div className="blackOverlay"></div>

        <div className={`ItemCarrosselTop ${(live ? "live" : "notLive")}`}>
          <p className='ItemCarrosselTop-p'>{live ? "Ao vivo" : getTimeRemaining()}</p>
        </div>

        <div className="ItemCarrosselBottom">
          <p className='ItemCarrosselBottom-p'>{itemTitle}</p>
        </div>
      </div>
    </Link>
  )
}

export default CarrosselItem;