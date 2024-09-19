// #region Imports
import style from "./style.module.css";
import React, { useRef, useEffect, useState } from 'react';
import CaixaInformacao from "Components/CaixaInformacao/page.tsx";
import { TooltipState } from "Redux/slices/tooltipHelperSlice";
// #endregion

const page = ({index, tooltip}:{index:number, tooltip:TooltipState}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: tooltip.position.top, left: tooltip.position.left });
  const [visible, setVisible] = useState(false);
  const padding = 4;

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setPosition({
        top: tooltip.position.top + padding,
        left: (tooltip.position.left - rect.width / 2 + tooltip.dimensoesReferencia.width / 2),
      });

      setVisible(true);
    }
  }, [tooltip, divRef.current]);

  return (
    <>
      <div ref={divRef} key={index} style={{position: 'absolute', top: position.top, left: position.left, visibility: visible ? 'visible' : 'hidden'}}>
        <CaixaInformacao props={tooltip.conteudo} />
      </div>
    </>
  );
}

export default page;