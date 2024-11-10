// #region Imports
import style from "./style.module.css";

import { useRef, useEffect, useState } from 'react';
import CaixaInformacao from "Components/CaixaInformacao/page.tsx";
import { TooltipState } from "Redux/slices/tooltipHelperSlice";
// #endregion

const page = ({ tooltip }: { tooltip: TooltipState }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: tooltip.position.top, left: tooltip.position.left });
  const [visible, setVisible] = useState(false);
  const padding = 4;

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      let newTop = tooltip.position.top + padding;
      let newLeft = tooltip.position.left - rect.width / 2 + tooltip.dimensoesReferencia.width / 2;

      if (newTop + rect.height > window.innerHeight) {
        newTop = tooltip.position.top - rect.height - tooltip.dimensoesReferencia.height - padding;
      }

      setPosition({
        top: newTop,
        left: newLeft,
      });

      setVisible(true);
    }
  }, [tooltip, divRef.current]);

  const handleMouseEnter = () => {
    console.log('handleMouseEnter no Tooltip/page')
    // dispatch(showTooltip(tooltip));
  };

  const handleMouseLeave = () => {
    console.log('handleMouseLeave no Tooltip/page')
    // dispatch(hideTooltip());
  };

  return (
    <div ref={divRef} className={style.wrapper_caixa_informacao} style={{ top: position.top, left: position.left, visibility: visible ? 'visible' : 'hidden' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <CaixaInformacao props={tooltip.conteudo} />
    </div>
  );
}

export default page;