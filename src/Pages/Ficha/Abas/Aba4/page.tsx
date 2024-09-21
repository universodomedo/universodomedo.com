// #region Imports
import style from "./style.module.css";
import { EstatisticasBuffaveisPersonagem, ReducaoDano } from "Types/classes.tsx";
// #endregion

const page: React.FC<{estatisticasBuffaveis:EstatisticasBuffaveisPersonagem, reducoesDanoPersonage:ReducaoDano[]}> = ({ estatisticasBuffaveis, reducoesDanoPersonage }) => {
    return (
      <div className={style.acoes_personagem}>
        <div className={style.acoes_executaveis}>
          <h2>Ações Padrões: {estatisticasBuffaveis.numeroAcoes.padrao}</h2>
          <h2>Ações de Movimento: {estatisticasBuffaveis.numeroAcoes.movimento}</h2>
          <h2>Reações: {estatisticasBuffaveis.numeroAcoes.reacao}</h2>
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
    )
  };
  
  export default page;