import "./style.css";
import { Link } from "react-router-dom";

const CarrosselItem = ({ id, titulo, imgUrl, tsInicio, live }: { id: number, titulo: string, imgUrl: string, tsInicio: Date, live: boolean }) => {
  const getTimeRemaining = ():string => {
    const now = new Date();

    const difference = tsInicio.getTime() - now.getTime();

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
    <Link to={`/session/${id}`}>
      <div className="container-rect-carousel" style={{backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,${live ? 0 : 1}) 100%), url(${imgUrl})`}}>
        
        <div className={`carousel-item-top ${(live ? "live" : "notLive")}`}>
          <p className='carousel-item-top-p'>{live ? "Ao vivo" : getTimeRemaining()}</p>
        </div>

        <div className="carousel-item-bottom">
          <p className='carousel-item-bottom-p'>{titulo}</p>
        </div>
      </div>
    </Link>
  )
}

export default CarrosselItem;