import "./style.css";
import CarrosselItem from "Components/SubComponents/CarrosselItem/page.tsx";
import useApi from "ApiConsumer/Consumer.tsx";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { CampaignSessionWithRelations } from "udm-types";

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

  const settings = { infinite: false, speed: 500, slidesToShow: 3, slidesToScroll: 1 };

  return (
    <>
      {proximasSessoes.length > 0 && (
        <div className="carousel-content">
          <div className="title">
            <p>Próximas Sessões</p>
          </div>
          <Slider {...settings}>
            {proximasSessoes.map((session: CampaignSessionWithRelations, index: number) => ( session.campaign && (
              <CarrosselItem key={`carrosselItem-${index}`} idSession={session.id} itemTitle={session.campaign!.subtitle} imgUrl={session.campaign!.artPath} tsStart={session.tsStart} live={false} />
            )))}
          </Slider>
        </div>
      )}
    </>
  );
}

export default SectionCarroussel;