// #region Imports
import style from "./style.module.css";
import { Ritual } from "Types/classes.tsx";
// #endregion

const page: React.FC<{rituaisPersonagem:Ritual[]}> = ({ rituaisPersonagem }) => {
  return (
    <div className={style.conteudo_rituais}>
      <h1>Rituais</h1>

      {/* {rituaisPersonagem.length > 0 && (
        <div className={style.rituais}>      
          {rituaisPersonagem.map(ritual => (
            <div className={style.icone_ritual} />
          ))}
        </div>
      )} */}

      <table>
        <thead><tr>
          <th>Nome</th>
          <th>Círculo</th>
          <th>Elemento</th>
          <th>Efeito</th>
          <th>Duração</th>
        </tr></thead>
        <tbody>
          {rituaisPersonagem.map(ritual => (
            <tr>
              <td>{ritual.nome}</td>
              <td>{ritual.circulo}</td>
              <td>{ritual.elemento}</td>
              <td>+2 ACRO</td>
              <td>1 Cena</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
  
export default page;