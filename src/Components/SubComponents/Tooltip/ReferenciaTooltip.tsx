// #region Imports
import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'Redux/store.ts';
import { generateTooltipId } from 'Components/SubComponents/Tooltip/TooltipIdGenerator.ts';
import { showTooltip, hideTooltip, registerTooltip, removeTooltip } from "Redux/slices/tooltipHelperSlice.ts";
import { TooltipProps } from "Types/classes.tsx";
// #endregion

const ReferenciaTooltip: React.FC<{ children: React.ReactNode; objeto: TooltipProps }> = ({ children, objeto }) => {
  const dispatch = useDispatch<AppDispatch>();
  const activatorRef = useRef<HTMLElement>(null);
  const tooltipId = useRef<number>(0);

  useEffect(() => {
    tooltipId.current = generateTooltipId();
    dispatch(registerTooltip({id: tooltipId.current, conteudo: objeto}));
    
    return () => {
      dispatch(removeTooltip({id: tooltipId.current}));
    };
  }, []);

  const handleMouseEnter = () => {
    if (activatorRef.current) {
      const rect = activatorRef.current.getBoundingClientRect();
      dispatch(showTooltip({ id: tooltipId.current, position: { top: rect.bottom + window.scrollY, left: rect.left }, dimensoes: { width: rect.width, height: rect.height }}));
    }
  };

  const handleMouseLeave = () => {
    dispatch(hideTooltip({id: tooltipId.current}));
  };

  return (
    <span
      ref={activatorRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </span>
  );
};

export default ReferenciaTooltip;