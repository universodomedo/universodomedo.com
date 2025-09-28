import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';

interface DivClicavelProps extends HTMLAttributes<HTMLDivElement> { desabilitado?: boolean; classeParaDesabilitado?: string; }

export const DivClicavel = ({ desabilitado = false, classeParaDesabilitado = '', onClick, className = '', ...props }: DivClicavelProps) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => { if (!desabilitado) onClick?.(e); };

    const classes = classNames(className, { [classeParaDesabilitado]: desabilitado });

    return <div {...props} className={classes} onClick={handleClick} aria-disabled={desabilitado} />;
};