// #region Imports
import style from "./style.module.css";
import BarraEstatisticaDanificavel from "Components/SubComponents/SubComponentesFicha/BarraEstatisticaDanificavel/page.tsx";
import { EstatisticaDanificavel, EstatisticasBuffaveisPersonagem, ReducaoDano } from 'Types/classes/index.ts';
// #endregion

const page = ({ estatisticasDanificaveis, estatisticasBuffaveis, reducoesDanoPersonage }: { estatisticasDanificaveis: EstatisticaDanificavel[], estatisticasBuffaveis: EstatisticasBuffaveisPersonagem, reducoesDanoPersonage: ReducaoDano[] }) => {
  return (
    <div className={style.div_estatisticas}>
      <div className={style.estatisticas_barras}>
        {estatisticasDanificaveis.map((estatistica, index) => (
          <BarraEstatisticaDanificavel key={index} titulo={estatistica.refEstatisticaDanificavel.nomeAbrev} valorAtual={estatistica.valor} valorMaximo={estatistica.valorMaximo} corBarra={estatistica.refEstatisticaDanificavel.cor}></BarraEstatisticaDanificavel>
        ))}
      </div>

      <div className={style.estatisticas_buffaveis}>
        <div className={style.acoes_executaveis}>
          {estatisticasBuffaveis.execucoes.map((execucao, index) => (
            <h2 key={index}>{execucao.refTipoExecucao.nomeExibicao}: {execucao.numeroAcoesAtuais}/{execucao.valorTotal}</h2>
          ))}
        </div>

        <div className={style.detalhes_acoes}>
          <h2>Defesa: {estatisticasBuffaveis.defesa.defesaTotal}</h2>
          <h2>Movimento: {estatisticasBuffaveis.deslocamento}m</h2>
        </div>

        <div className={style.reducoes_dano}>
          <table>
            <thead>
              <tr><th>Classificação</th><th>Redução</th></tr>
            </thead>
            <tbody>
              {reducoesDanoPersonage.map((reducaoDanoPersonagem, index) => (
                <tr key={index}>
                  <td>{reducaoDanoPersonagem.tipoDano.nome}</td>
                  <td>{reducaoDanoPersonagem.valorTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default page;