// #region Imports
import style from './style.module.css';
import React, { useRef, useEffect, useState } from 'react';import { useSelector } from 'react-redux';
import { RootState } from 'Redux/store.ts';
import CaixaInformacao from "Components/CaixaInformacao/page.tsx";
// #endregion

const TooltipContainer: React.FC = () => {
  const tooltips = useSelector((state: RootState) => state.tooltipHelper);

  const visibleTooltips = React.useMemo(() => {
    return tooltips.filter(tooltip => tooltip.visible === true);
  }, [tooltips]);

  return (
    <div className={style.tooltip_container}>
      {visibleTooltips.map((tooltip, index) => (
        <div key={index} style={{position: 'absolute', top: tooltip.position.top, left: tooltip.position.left}}>
          <CaixaInformacao props={tooltip.conteudo} />
        </div>
      ))};
    </div>
  );
};

export default TooltipContainer;