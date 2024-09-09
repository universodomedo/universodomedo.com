// #region Imports
import style from "./style.module.css";
import { Atributo, Pericia } from "Types/classes.tsx";
import { toast } from 'react-toastify';
// #endregion

const page: React.FC<{atributosPersonagem:Atributo[], periciasPersonagem:Pericia[]}> = ({ atributosPersonagem, periciasPersonagem }) => {
  return (
    <div className={style.atributos_personagem}>
      {atributosPersonagem.map((atributoPersonagem, index) => (
        <div key={`atributo-${index}`} className={`${style.atributo_personagem} ${style[atributoPersonagem.atributo.nomeAbrev]}`}>
          <h2>{atributoPersonagem.atributo.nomeAbrev} [{atributoPersonagem.valorTotal}]</h2>
          <div className={style.pericias_personagem}>
            {periciasPersonagem.filter(periciaPersonagem => periciaPersonagem.pericia.idAtributo === atributoPersonagem.atributo.id)?.map((periciaPersonagem, index) => (
              <div key={`pericia-${index}`} className={style.pericia_personagem}>
                <button onClick={() => {toast(<div dangerouslySetInnerHTML={{ __html: periciaPersonagem.realizarTeste()}} />)}}>{periciaPersonagem.pericia.nomeAbrev}</button>
                <h3>{periciaPersonagem.valorTotal}</h3>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
};

export default page;