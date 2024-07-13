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
    <div className='section-content'>
      <div className='title'>
        <p>Próximas Sessões</p>
      </div>

      
    </div>
  )
}

export default SectionCarroussel;