// #region Imports
import style from './style.module.css';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'Redux/store.ts';
import Tooltip from "Components/SubComponents/Tooltip/page.tsx";
// #endregion

const TooltipContainer: React.FC = () => {
  const tooltips = useSelector((state: RootState) => state.tooltipHelper);

  const visibleTooltips = React.useMemo(() => {
    return tooltips.filter(tooltip => tooltip.visible === true);
  }, [tooltips]);

  return (
    <div className={style.tooltip_container}>
      {visibleTooltips.map((tooltip, index) => (
        <Tooltip key={index} index={index} tooltip={tooltip}/>
      ))}
    </div>
  );
};

export default TooltipContainer;