// #region Imports
import style from './style.module.css';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import CaixaInformacao from "Components/CaixaInformacao/page.tsx";
import { CaixaInformacaoProps, IconeCustomizadoProps } from "Types/classes.tsx";
// #endregion

const TooltipManager: React.FC = () => {
  const [tooltipContent, setTooltipContent] = useState<CaixaInformacaoProps | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && target instanceof HTMLElement) {
        const contentString = target.getAttribute('data-hoverbox-content');
        if (contentString) {
          const content: CaixaInformacaoProps = JSON.parse(contentString);
          const rect = target.getBoundingClientRect();
          setTooltipContent(content);
          setTooltipPosition({ top: rect.bottom + window.scrollY, left: rect.left + rect.width / 2 + window.scrollX });
        }
      }
    };

    const handleMouseLeave = () => {
      setTooltipContent(null);
    };

    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  return ReactDOM.createPortal(
    <div className={`${style.tooltip_fixed} ${tooltipContent ? style.visible : style.hidden}`} style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
      <CaixaInformacao props={tooltipContent!}/>
    </div>
  , document.body);
};

export default TooltipManager;