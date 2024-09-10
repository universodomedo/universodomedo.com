// #region Imports
import style from "./style.module.css";
import { CharacterDetalhes } from "Types/classes.tsx";
// #endregion

const page: React.FC<{detalhesPersonagem:CharacterDetalhes}> = ({ detalhesPersonagem }) => {
  return (
    <>
      <div className={style.ficha_detalhes}>
        <h3 className={style.detalhe_cantos}>{detalhesPersonagem.classe}</h3>
        <h1 className={style.detalhe_meio}>{detalhesPersonagem.nome}</h1>
        <h3 className={style.detalhe_cantos}>{`${detalhesPersonagem.nex}%`}</h3>
      </div>
    </>
  )
};

export default page;