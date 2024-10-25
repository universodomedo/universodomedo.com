import "./style.css";
import { useParams } from "react-router-dom";
import apiClient from "ApiConsumer/Consumer.tsx";
import { useEffect, useState } from "react";
import { RLJ_SessaoAventura } from "udm-types";

const Sessions = () => {
    const {idSession} = useParams();
    const [fetchedData, setFetchedData] = useState<RLJ_SessaoAventura>({} as RLJ_SessaoAventura);

    useEffect(() => {
        const fetchData = async () => {
          const response = await apiClient<RLJ_SessaoAventura>("sessoes/getSessaoAventuraPorId", { params: idSession });
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
                <img src={fetchedData.aventura?.caminhoArteOficial} />
            </div>
            <div className="main-bottom">
                <h1>{fetchedData.aventura?.subtitulo}</h1>
            </div>
        </main>
        <aside className="right-sidebar">

        </aside>
      </div>
    )
}

export default Sessions;