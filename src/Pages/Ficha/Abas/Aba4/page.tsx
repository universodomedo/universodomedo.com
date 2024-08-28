// #region Imports
import style from "./style.module.css";
import { ReducaoDano } from "Types/classes.tsx";
// #endregion

const page: React.FC<{reducoesDanoPersonage:ReducaoDano[]}> = ({ reducoesDanoPersonage }) => {
    return (
      <div className={style.acoes_personagem}>
        <div className={style.acoes_executaveis}>
          <h2>Ações Padrões: 1</h2>
          <h2>Ações de Movimento: 1</h2>
          <h2>Reações: 1</h2>
          <h2>Ações Ritualísticas: 1</h2>
          <h2>Ações Investigavas: 1</h2>
        </div>
        <div className={style.detalhes_acoes}>
          <h2>Defesa: 10</h2>
          <h2>Movimento: 10m</h2>
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