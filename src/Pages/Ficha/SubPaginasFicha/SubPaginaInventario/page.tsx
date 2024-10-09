// #region Imports
import style from './style.module.css';
import React, { useState } from 'react';
import { Inventario, EstatisticasBuffaveisPersonagem, Item } from "Types/classes.tsx";
import { useLoading } from "Components/LayoutAbas/hooks.ts";
import { Consulta, ConsultaProvider } from "Components/ConsultaFicha/page.tsx";
import BarraEstatisticaDanificavel from "Components/SubComponents/SubComponentesFicha/BarraEstatisticaDanificavel/page.tsx";

import IconeItem from "Components/IconeItem/page.tsx";
import ReferenciaTooltip from "Components/SubComponents/Tooltip/ReferenciaTooltip.tsx";

import { useDispatch } from "react-redux";
import { setCacheFiltros } from "Redux/slices/abasHelperSlice.ts";
// #endregion

const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
}

const page: React.FC<{ abaId: string; estatisticasBuffaveis: EstatisticasBuffaveisPersonagem, inventarioPersonagem: Inventario, abrirAbaAcao: () => void; }> = ({ abaId, estatisticasBuffaveis, inventarioPersonagem, abrirAbaAcao }) => {
  const { stopLoading } = useLoading();
  const dispatch = useDispatch();
  const [contextMenu, setContextMenu] = useState(initialContextMenu);

  const clickItem = (item: Item) => {
    if (item.acoes.length === 0) return;
    
    abrirAbaAcao();

    dispatch(setCacheFiltros({ abaId: 'aba7', filtro: [ { idFiltro: 1, idOpcao: [item.nome.padrao] } ], updateExterno: true }));
  }

  const renderItem = (item: Item, index: number) => (
    <ReferenciaTooltip key={index} objeto={item.tooltipPropsAgrupado}>
      <IconeItem quantidadeAgrupada={item.tooltipPropsAgrupado.numeroUnidades} props={item.tooltipPropsAgrupado.iconeCustomizado} onClick={() => clickItem(item)} />
    </ReferenciaTooltip>
  );

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    e.preventDefault();

    const { pageX, pageY } = e;
    setContextMenu({show: true, x: pageX, y: pageY});
  }

  return (
    <>
      {estatisticasBuffaveis.extremidades.length > 0 && (
        <div className={style.container_extremidades}>
          {estatisticasBuffaveis.extremidades.map((extremidade, index) => (
            <div key={index} className={style.extremidade}>
              <h1>Extremidade {extremidade.id}</h1>
              {extremidade.refItem ? (
                <ReferenciaTooltip key={index} objeto={extremidade.refItem.tooltipPropsSingular}>
                  <IconeItem quantidadeAgrupada={extremidade.refItem.tooltipPropsSingular.numeroUnidades} props={extremidade.refItem.tooltipPropsSingular.iconeCustomizado} onClick={() => clickItem(extremidade.refItem!)} />
                </ReferenciaTooltip>
              ) : 
                <div className={style.icones_extremidade_vazia}></div>
              }
            </div>
          ))}
        </div>
      )}

      <ConsultaProvider<Item> abaId={abaId} registros={[inventarioPersonagem.agrupamento]} filtroProps={Item.filtroProps} onLoadComplete={stopLoading} tituloDivisoesConsulta={ { usaSubtitulos: false, divisoes: [''] } }>
        <Consulta renderItem={renderItem} />
      </ConsultaProvider>
    </>
  );
};

export default page;






// const page: React.FC<{ estatisticasBuffaveis: EstatisticasBuffaveisPersonagem, inventarioPersonagem: Inventario }> = ({ estatisticasBuffaveis, inventarioPersonagem }) => {
//   return (
//     <div className={style.conteudo_inventario}>
//       <h1>Inventário</h1>

//       {estatisticasBuffaveis.extremidades.length > 0 ? (
//         <div className={style.container_extremidades}>
//           {estatisticasBuffaveis.extremidades.map((extremidade, index) => (
//             <div key={index} className={style.extremidade}>
//               <h1 onClick={() => { extremidade.empunhar(0); }}>Extremidade {extremidade.id}</h1>
//               {extremidade.idItemEmpunhado !== undefined && (
//                 <h2>{extremidade.refItem!.nome}</h2>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : <></>}

//       <div className={style.info_inventario}>
//         <h1>Espaços</h1>
//         <BarraEstatisticaDanificavel valorAtual={inventarioPersonagem.espacosUsados} valorMaximo={estatisticasBuffaveis.espacoInventario.espacoTotal} corBarra={"#AAAAAA"}></BarraEstatisticaDanificavel>
//       </div>
//       <div className={style.inventario_personagem}>
//         {inventarioPersonagem && (
//           <table>
//             <thead>
//               <tr><th></th><th>Nome</th><th>Peso</th><th>Categoria</th></tr>
//             </thead>
//             <tbody>
//               {inventarioPersonagem.items.map((item, index) => (
//                 <tr key={index}>
//                   <td width={"1%"}>{item.estaEmpunhado() ? item.refExtremidade?.id : ''}</td>
//                   <td>{item.nome}</td>
//                   <td>{item.peso}</td>
//                   <td>{item.categoria}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   )
// };

// export default page;