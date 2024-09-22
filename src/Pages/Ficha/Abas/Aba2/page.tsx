// #region Imports
import style from "./style.module.css";
import BarraEstatisticaDanificavel from "Components/SubComponents/SubComponentesFicha/BarraEstatisticaDanificavel/page.tsx";
import { EstatisticaDanificavel } from "Types/classes.tsx";
// #endregion

const page: React.FC<{ estatisticasDanificaveis: EstatisticaDanificavel[] }> = ({ estatisticasDanificaveis }) => {
  return (
    <div className={style.estatisticas_barras}>
      {estatisticasDanificaveis.map((estatistica, index) => (
        <div key={index} className={style.estatistica_barra}>
          <h2>{estatistica.refEstatisticaDanificavel.nomeAbrev}</h2>
          <BarraEstatisticaDanificavel valorAtual={estatistica.valor} valorMaximo={estatistica.valorMaximo} corBarra={estatistica.refEstatisticaDanificavel.cor}></BarraEstatisticaDanificavel>
        </div>
      ))}
    </div>
  )
}

export default page;