// #region Imports
import style from "./style.module.css";
import { Acao } from "Types/classes.tsx";
// #endregion

const page: React.FC<{acoesPersonagem:Acao[]}> = ({ acoesPersonagem }) => {
    return (
      <div className={style.conteudo_acoes}>
        <h1>Ações</h1>
        
        {acoesPersonagem && acoesPersonagem.map((acao, index) => (
          <button key={index} onClick={acao.executa}>{acao.nome}</button>
        ))}
      </div>
    )
  };
  
  export default page;