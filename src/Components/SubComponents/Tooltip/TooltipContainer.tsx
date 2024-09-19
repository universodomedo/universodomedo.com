// #region Imports
import style from './style.module.css';
import React, { useRef, useEffect, useState } from 'react';import { useSelector } from 'react-redux';
import { RootState } from 'Redux/store.ts';
import CaixaInformacao from "Components/CaixaInformacao/page.tsx";
// #endregion

const TooltipContainer: React.FC = () => {
  const tooltips = useSelector((state: RootState) => state.tooltipHelper);

  return (
    <div className={style.tooltip_container}>
      {tooltips.filter(tooltip => tooltip.visible === true).map((tooltip, index) => {

        return (
          <div key={index} style={{position: 'absolute', top: tooltip.position.top, left: tooltip.position.left}}>
            <CaixaInformacao props={tooltip.conteudo} />
          </div>
        );
      })};
    </div>
  );
};

export default TooltipContainer;