// #region Imports
import style from "./style.module.css";
import { Buff } from "Types/classes.tsx";
import TesteGridEfeitos from "Components/SubComponents/TesteGridEfeitos/page.tsx";
// #endregion

const page: React.FC<{buffsPersonagem:Buff[]}> = ({ buffsPersonagem }) => {
  return (
    <div className={style.conteudo_efeitos}>
      <h1>Efeitos Ativos</h1>
        {/* <hr />
        {buffsPersonagem && buffsPersonagem.map(buff => (
            `${buff.idRefBuff} - ${buff.valor}`
        ))}
        <hr /> */}
        {/* <TesteGridEfeitos buffs={buffsPersonagem}/> */}
      <table>
        <thead><tr>
          <th>Nome</th>
          <th>Efeito</th>
          <th>Duração</th>
        </tr></thead>
        <tbody>
          {buffsPersonagem.map(buff => (
            <tr>
              <td>Aprimorar Acrobacia</td>
              <td>+2 ACRO</td>
              <td>1 Cena</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Efeitos Ativos: {buffsPersonagem.length}</h2>
    </div>
  )
}

export default page;