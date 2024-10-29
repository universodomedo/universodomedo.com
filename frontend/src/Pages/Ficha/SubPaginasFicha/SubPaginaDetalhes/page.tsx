// #region Imports
import style from "./style.module.css";
import { PersonagemDetalhes } from 'Types/classes/index.ts';
// #endregion

const page: React.FC<{ detalhesPersonagem: PersonagemDetalhes }> = ({ detalhesPersonagem }) => {
  return (
    <>
      <div className={style.ficha_detalhes}>
        <h3 className={style.detalhe_cantos}>{detalhesPersonagem.refClasse.nome}</h3>
        <h1 className={style.detalhe_meio}>{detalhesPersonagem.nome}</h1>
        <h3 className={style.detalhe_cantos}>{detalhesPersonagem.refNivel.nomeDisplay}</h3>
      </div>
    </>
  )
};

export default page;