// #region Imports
import style from "./style.module.css";
import React, { useState } from 'react';
import { Inventario, EstatisticasBuffaveisPersonagem } from "Types/classes.tsx";
// #endregion

const page: React.FC<{estatisticasBuffaveis:EstatisticasBuffaveisPersonagem, inventarioPersonagem:Inventario}> = ({ estatisticasBuffaveis, inventarioPersonagem }) => {
  return (
    <div className={style.conteudo_inventario}>
      <h1>Inventário</h1>

      {estatisticasBuffaveis.extremidades.length > 0 ? (
        <div className={style.container_extremidades}>
          {estatisticasBuffaveis.extremidades.map((extremidade, index) => (
            <div key={index} className={style.extremidade}>
              <h1 onClick={() => {extremidade.empunhar(0);}}>Extremidade {extremidade.id}</h1>
              {extremidade.idItemEmpunhado !== undefined && (
                <h2>{extremidade.refItem!.nome}</h2>
              )}
            </div>
          ))}
        </div>
      ) : <></>}

      <div className={style.info_inventario}>
        <span>Espaços {inventarioPersonagem.espacosUsados}/{estatisticasBuffaveis.espacoInventario.espacoTotal}</span>
        <button>Adicionar Item</button>
      </div>
      <div className={style.inventario_personagem}>
        {inventarioPersonagem && (
        <table>
          <thead>
            <tr><th>Nome</th><th>Peso</th><th>Categoria</th></tr>
          </thead>
          <tbody>
            {inventarioPersonagem.items.map((item, index) => (
              <tr key={index} className={item.estaEmpunhado() ? style.item_empunhado : ''}>
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