// #region Imports
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'Redux/store.ts';
import { showTooltip, hideTooltip } from "Redux/slices/tooltipHelperSlice.ts";
import { TooltipProps } from "Types/classes.tsx";
// #endregion

const ReferenciaTooltip: React.FC<{ children: React.ReactNode; objeto: TooltipProps }> = ({ children, objeto }) => {
  const dispatch = useDispatch<AppDispatch>();
  const activatorRef = useRef<HTMLElement>(null);

  const handleMouseEnter = () => {
    if (activatorRef.current) {
      const rect = activatorRef.current.getBoundingClientRect();
      dispatch(showTooltip({ position: { top: rect.bottom + window.scrollY, left: rect.left }, dimensoes: { width: rect.width, height: rect.height }, conteudo: objeto}));
    }
  };

  const handleMouseLeave = () => {
    dispatch(hideTooltip());
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