import "./SectionCarroussel.css";
import CarrosselItem from '../../SubComponents/CarrosselItem/CarrosselItem';
import { useApi } from "../../../ApiConsumer/Consumer.tsx";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { Campaign, CampaignSession, CampaignSessionWithRelations } from "udm-types";

import imgCapa1 from "../../Assets/testeCapa1.png";
import imgCapa2 from "../../Assets/testeCapa2.png";
import imgCapa3 from "../../Assets/testeCapa3.png";


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SectionCarroussel = () => {
  const [fetchedData, setFetchedData] = useState<CampaignSessionWithRelations[]>([{} as CampaignSessionWithRelations]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await useApi<CampaignSessionWithRelations[]>("session/getNextSessions");
      setFetchedData(response);
    };

    fetchData();
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  }

  return (
    <div className='carousel-content'>
      <div className='title'>
        <p>Próximas Sessões</p>
      </div>

      <div className="slider-container">
        <Slider {...settings}>
          <CarrosselItem itemTitle={"Apenas uma Prece"} imgUrl={imgCapa1} tsStart={new Date()} live={true}/>
          <CarrosselItem itemTitle={"Black Ops"} imgUrl={imgCapa2} tsStart={new Date()} live={false}/>
          <CarrosselItem itemTitle={"Antes do Abismo"} imgUrl={imgCapa3} tsStart={new Date()} live={false}/>
        </Slider>
      </div>
    </div>
  )
}

export default SectionCarroussel;