// #region Imports
import style from './style.module.css';
import { ReactNode } from 'react';

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
// #endregion

function Tooltip({ open, defaultOpen, onOpenChange, children, ...props }: { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; children: ReactNode; }) {
	return (
		<TooltipPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} delayDuration={700} >
			{children}
		</TooltipPrimitive.Root>
	);
}

Tooltip.Trigger = function TooltipTrigger({ children }: { children: ReactNode }) {
	return (
		<TooltipPrimitive.Trigger className={style.tooltip_gatilho} asChild>
			{children}
		</TooltipPrimitive.Trigger>
	);
};

Tooltip.Content = function TooltipContent({ children, ...props }: { children: ReactNode; [key: string]: any; }) {
	return (
		<TooltipPrimitive.Content className={style.tooltip_conteudo} side="top" align="center" sideOffset={5} {...props} >
			{children}
			<TooltipPrimitive.Arrow className={style.tooltip_seta} width={11} height={5} />
		</TooltipPrimitive.Content>
	);
};

export default Tooltip;