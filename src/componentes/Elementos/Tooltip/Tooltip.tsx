import styles from './styles.module.css';
import { ReactNode } from 'react';

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { IconeLinkInformativo } from 'Componentes/Elementos/IconeLinkInformativo/IconeLinkInformativo';

function Tooltip({ open, defaultOpen, onOpenChange, children, ...props }: { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; children: ReactNode; }) {
	return (
		<TooltipPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} delayDuration={700} >
			{children}
		</TooltipPrimitive.Root>
	);
}

Tooltip.Trigger = function TooltipTrigger({ children }: { children: ReactNode }) {
	return (
		<TooltipPrimitive.Trigger className={styles.tooltip_gatilho} asChild>
			{children}
		</TooltipPrimitive.Trigger>
	);
};

Tooltip.Content = function TooltipContent({ children, propsLink, ...props }: { children: ReactNode; propsLink?: { href: string; texto?: string };[key: string]: any; }) {
	return (
		<TooltipPrimitive.Content className={styles.tooltip_conteudo} side="top" align="center" sideOffset={5} {...props} >
			{children}
			{propsLink && (
				<div className={styles.recipiente_info_tooltip}>
					<IconeLinkInformativo href={propsLink.href} texto={propsLink?.texto || "Visitar Definição"} />
				</div>
			)}
			<TooltipPrimitive.Arrow className={styles.tooltip_seta} width={11} height={5} />
		</TooltipPrimitive.Content>
	);
};

export default Tooltip;