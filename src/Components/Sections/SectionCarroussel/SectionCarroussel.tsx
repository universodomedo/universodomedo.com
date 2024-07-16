import "./SectionCarroussel.css";
import CarrosselItem from '../../SubComponents/CarrosselItem/CarrosselItem';
import useApi from "../../../ApiConsumer/Consumer.tsx";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { CampaignSessionWithRelations } from "udm-types";

import imgCapa1 from "../../Assets/testeCapa1.png";
import imgCapa2 from "../../Assets/testeCapa2.png";
import imgCapa3 from "../../Assets/testeCapa3.png";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SectionCarroussel = () => {
  const [proximasSessoes, setProximasSessoes] = useState<CampaignSessionWithRelations[]>([{} as CampaignSessionWithRelations]);

  useEffect(() => {
    const proximasSessoes = async () => {
      const response = await useApi<CampaignSessionWithRelations[]>("session/getNextSessions");
      setProximasSessoes(response);
    };

    proximasSessoes();
  }, []);

  const settings = { infinite: true, speed: 500, slidesToShow: 3, slidesToScroll: 1 };

  return (
    <>
      {proximasSessoes.length > 0 && (
        <div className='carousel-content'>
          <div className='title'>
            <p>Próximas Sessões</p>
          </div>

          <div className="slider-container">
            <Slider {...settings}>
              <CarrosselItem itemTitle={"Apenas uma Prece"} idSession={0} imgUrl={imgCapa1} tsStart={new Date("2024-07-14T01:07:00")} live={false}/>
              <CarrosselItem itemTitle={"Black Ops"} idSession={0} imgUrl={imgCapa2} tsStart={new Date("2024-07-15T23:00:00")} live={false}/>
              <CarrosselItem itemTitle={"Antes do Abismo"} idSession={0} imgUrl={imgCapa3} tsStart={new Date("2024-09-14T12:00:00")} live={false}/>
              {proximasSessoes.map((session: CampaignSessionWithRelations, index: number) => ( session.campaign && (
                <CarrosselItem key={`carrosselItem-${index}`} idSession={session.id} itemTitle={session.campaign!.subtitle} imgUrl={session.campaign!.artPath} tsStart={session.tsStart} live={false} />
              )))}
            </Slider>
          </div>
        </div>
      )}
    </>
  );
}

export default SectionCarroussel;