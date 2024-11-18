// #region Imports
import style from './style.module.css';
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
// #endregion

interface TooltipProps {
	children: any;
	content: any;
	open?: any;
	defaultOpen?: any;
	onOpenChange?: any;
}

export function Tooltip({
	children,
	content,
	open,
	defaultOpen,
	onOpenChange,
	...props
}: TooltipProps) {
	return (
		<TooltipPrimitive.Root
			open={open}
			defaultOpen={defaultOpen}
			onOpenChange={onOpenChange}
		>
			<TooltipPrimitive.Trigger asChild>
				{children}
			</TooltipPrimitive.Trigger>
			<TooltipPrimitive.Content className={style.tooltip_conteudo} side="top" align="center" {...props} sideOffset={5}>
				{content}
				<TooltipPrimitive.Arrow className={style.tooltip_seta} width={11} height={5} />
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Root>
	);
}