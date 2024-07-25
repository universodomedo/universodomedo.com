import "./style.css";
import { useParams } from "react-router-dom";
import apiClient from "ApiConsumer/Consumer.tsx";
import { useEffect, useState } from "react";
import { CampaignSessionWithRelations } from "udm-types";

const Sessions = () => {
    const {idSession} = useParams();
    const [fetchedData, setFetchedData] = useState<CampaignSessionWithRelations>({} as CampaignSessionWithRelations);

    useEffect(() => {
        const fetchData = async () => {
          const response = await apiClient<CampaignSessionWithRelations>("session/getSessionCampaignById", { params: idSession });
          setFetchedData(response);
        };
    
        fetchData();
      }, []);

    return (
      <div className='teste'>
        <aside className="sidebar">
            
        </aside>
        <main className="main-content">
            <div className="main-top">
                <img src={fetchedData.campaign?.artPath} />
            </div>
            <div className="main-bottom">
                <h1>{fetchedData.campaign?.subtitle}</h1>
            </div>
        </main>
        <aside className="right-sidebar">

        </aside>
      </div>
    )
}

export default Sessions;