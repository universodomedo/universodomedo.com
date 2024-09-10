import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import style from './style.module.css'; // Substitua pelo caminho do seu CSS

type TooltipContent = {
  title?: string;
  description?: string;
  [key: string]: any; // Para permitir campos personalizados
};

const TooltipManager: React.FC = () => {
  const [tooltipContent, setTooltipContent] = useState<TooltipContent | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && target instanceof HTMLElement) {
        const contentString = target.getAttribute('data-hoverbox-content');
        if (contentString) {
          const content: TooltipContent = JSON.parse(contentString);
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
    <div
      className={`${style.tooltip_fixed} ${tooltipContent ? style.visible : style.hidden}`}
      style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
    >
      {tooltipContent && (
        <>
          {tooltipContent.title && <h4>{tooltipContent.title}</h4>}
          {tooltipContent.description && <p>{tooltipContent.description}</p>}
          {/* Renderizar outros campos personalizados */}
          {Object.keys(tooltipContent).map((key) =>
            key !== 'title' && key !== 'description' ? (
              <p key={key}>
                <strong>{key}:</strong> {tooltipContent[key]}
              </p>
            ) : null
          )}
        </>
      )}
    </div>,
    document.body
  );
};

export default TooltipManager;