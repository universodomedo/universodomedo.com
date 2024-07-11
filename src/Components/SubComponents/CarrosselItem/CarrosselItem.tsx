import React from 'react'
import "./CarrosselItem.css";

const CarrosselItem = ({ itemTitle, imgUrl, live }: { itemTitle: string, imgUrl: string, live: boolean }) => {
  const liveText = (live ? "Ao vivo" : "Próxima Sessão 00/00");
  const classLive = (live ? "live" : "notLive");

  return (
    <div className="retanguloCarrossel">
      <img className='imgRetanguloCarroussel' src={imgUrl} alt="" />
      <div className="blackOverlay"></div>

      <div className={`ItemCarrosselTop ${classLive}`}>
        <p className='ItemCarrosselTop-p'>{liveText}</p>
      </div>

      <div className="ItemCarrosselBottom">
        <p className='ItemCarrosselBottom-p'>{itemTitle}</p>
      </div>
    </div>
  )
}

export default CarrosselItem;