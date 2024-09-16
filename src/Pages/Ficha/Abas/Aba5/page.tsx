// #region Imports
import style from "./style.module.css";
import { Item } from "Types/classes.tsx";
// #endregion

const page: React.FC<{inventarioPersonagem:Item[]}> = ({ inventarioPersonagem }) => {
    return (
      <div className={style.conteudo_inventario}>
        <h1>Inventário</h1>
        
        <div className={style.info_inventario}>
          <span>Espaços 2/10</span>
          <button>Adicionar Item</button>
        </div>
        <div className={style.inventario_personagem}>
          {inventarioPersonagem && (
          <table>
            <thead>
              <tr><th>Nome</th><th>Peso</th><th>Categoria</th></tr>
            </thead>
            <tbody>
              { inventarioPersonagem.map((item, index) => (
                <tr key={index}>
                  <td>{item.nome}</td>
                  <td>{item.peso}</td>
                  <td>{item.categoria}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    )
  };
  
  export default page;