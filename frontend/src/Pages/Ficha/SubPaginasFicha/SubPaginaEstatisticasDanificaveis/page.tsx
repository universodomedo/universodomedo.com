// #region Imports
import style from "./style.module.css";
import BarraEstatisticaDanificavel from "Components/SubComponents/SubComponentesFicha/BarraEstatisticaDanificavel/page.tsx";
import { EstatisticaDanificavel } from 'Types/classes/index.ts';
// #endregion

const page: React.FC<{ estatisticasDanificaveis: EstatisticaDanificavel[] }> = ({ estatisticasDanificaveis }) => {
  return (
    <div className={style.estatisticas_barras}>
      {estatisticasDanificaveis.map((estatistica, index) => (
        <BarraEstatisticaDanificavel key={index} titulo={estatistica.refEstatisticaDanificavel.nomeAbrev} valorAtual={estatistica.valor} valorMaximo={estatistica.valorMaximo} corBarra={estatistica.refEstatisticaDanificavel.cor}></BarraEstatisticaDanificavel>
      ))}
    </div>
  )
}

export default page;