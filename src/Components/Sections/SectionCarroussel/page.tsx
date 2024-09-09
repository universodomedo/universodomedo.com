import "./style.css";
import CarrosselItem from "Components/SubComponents/CarrosselItem/page.tsx";
import useApi from "ApiConsumer/Consumer.tsx";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { RLJ_SessaoAventura } from "udm-types";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SectionCarroussel = () => {
  const [proximasSessoes, setProximasSessoes] = useState<RLJ_SessaoAventura[]>([{} as RLJ_SessaoAventura]);

  // useEffect(() => {
  //   const proximasSessoes = async () => {
  //     const response = await useApi<RLJ_SessaoAventura[]>("sessoes/getProximasSessoes");
  //     setProximasSessoes(response);
  //   };

  //   proximasSessoes();
  // }, []);

  const settings = { infinite: false, speed: 500, slidesToShow: 3, slidesToScroll: 1 };

  return (
    <>
      {proximasSessoes.length > 0 && (
        <div className="carousel-content">
          <div className="title">
            <p>Próximas Sessões</p>
          </div>
          <Slider {...settings}>
            {proximasSessoes.map((sessao: RLJ_SessaoAventura, index: number) => ( sessao.aventura && (
              <CarrosselItem key={`carrosselItem-${index}`} id={sessao.id} titulo={(sessao.aventura!.subtitulo === '' ? sessao.aventura!.titulo : sessao.aventura!.subtitulo)} imgUrl={sessao.aventura!.caminhoArteOficial} tsInicio={sessao.tsInicioPrevisto} live={false} />
            )))}
          </Slider>
        </div>
      )}
    </>
  );
}

export default SectionCarroussel;