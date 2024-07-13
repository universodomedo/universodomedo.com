import "./CarrosselItem.css";

const CarrosselItem = ({ itemTitle, imgUrl, tsStart, live }: { itemTitle: string, imgUrl: string, tsStart: Date, live: boolean }) => {
  // const getTimeRemaining  = () => {
  //   console.log(typeof tsStart);
  //   if (!(tsStart instanceof Date)) {
  //     console.error('Invalid tsStart prop. Please provide a valid Date object.');
  //     return 'Invalid Date'; // Or handle the error gracefully
  //   }

  //   const now = new Date();
  //   const then = tsStart;

  //   const difference = then.getTime() - now.getTime();

  //   if (difference >= 86400000) {
  //     const days = Math.floor(difference / 86400000);
  //     return `${days} dia${days > 1 ? 's' : ''}`;
  //   } else if (difference >= 3600000) {
  //     const hours = Math.floor(difference / 3600000);
  //     return `${hours} hora${hours > 1 ? 's' : ''}`;
  //   } else if (difference >= 60000) {
  //     const minutes = Math.floor(difference / 60000);
  //     return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
  //   } else {
  //     const seconds = Math.floor(difference / 1000);
  //     return `${seconds} segundo${seconds > 1 ? 's' : ''}`;
  //   }
  // };

  // const timeRemainingText = getTimeRemaining();

  // const liveText = (live ? "Ao vivo" : `Próxima Sessão em ${timeRemainingText}`);
  const liveText = (live ? "Ao vivo" : `Próxima Sessão em 0 dias`);
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