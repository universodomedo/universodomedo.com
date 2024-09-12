// #region Imports
import style from "./style.module.css";
import BarraEstatisticaDanificavel from "Components/SubComponents/SubComponentesFicha/BarraEstatisticaDanificavel/page.tsx";
import { EstatisticasDanificaveisPersonagem } from "Types/classes.tsx";
// #endregion

const page: React.FC<{estatisticasDanificaveis:EstatisticasDanificaveisPersonagem}> = ({ estatisticasDanificaveis }) => {
  return (
    <div className={style.estatisticas_barras}>
      {estatisticasDanificaveis.obterListaEstatisticasDanificaveis().map((estatistica, index) => (
        <div key={index} className={style.estatistica_barra}>
          <h2>{estatistica.estatisticaDanificavel.nomeAbrev}</h2>
          <BarraEstatisticaDanificavel pvAtual={estatistica.valor} pvMaximo={estatistica.valorMaximo} corBarra={estatistica.estatisticaDanificavel.cor}></BarraEstatisticaDanificavel>
        </div>
      ))}
    </div>
  )
}

export default page;