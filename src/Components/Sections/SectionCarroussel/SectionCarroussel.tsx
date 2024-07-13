import "./SectionCarroussel.css";
import CarrosselItem from '../../SubComponents/CarrosselItem/CarrosselItem';
import { useApi } from "../../../ApiConsumer/Consumer.tsx";
import { useEffect, useState } from "react";
import { Campaign, CampaignSession, CampaignSessionWithRelations } from "udm-types";

import imgCapa1 from "../../Assets/testeCapa1.png";
import imgCapa2 from "../../Assets/testeCapa2.png";
import imgCapa3 from "../../Assets/testeCapa3.png";

const SectionCarroussel = () => {
  const [fetchedData, setFetchedData] = useState<CampaignSessionWithRelations[]>([{} as CampaignSessionWithRelations]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await useApi<CampaignSessionWithRelations[]>("session/getNextSessions");
      setFetchedData(response);
    };

    fetchData();
  }, []);

  return (
    <div className='section'>
        <div className='title'>
          <p>Próximas Sessões</p>
        </div>

        <div className='parenteCarroussel'>
          <CarrosselItem itemTitle={"Apenas uma Prece"} imgUrl={imgCapa1} tsStart={new Date()} live={true}/>
          <CarrosselItem itemTitle={"Black Ops"} imgUrl={imgCapa2} tsStart={new Date()} live={false}/>
          <CarrosselItem itemTitle={"Antes do Abismo"} imgUrl={imgCapa3} tsStart={new Date()} live={false}/>
          {/* {fetchedData.length > 0 && fetchedData.map((session:CampaignSessionWithRelations, index:number) => {
            return <CarrosselItem key={`carrosselItem-${index}`} itemTitle={session.campaign.subtitle} imgUrl={session.campaign.artPath} tsStart={session.tsStart} live={false} />
          })} */}
        </div>
  </div>    
  )
}

export default SectionCarroussel;