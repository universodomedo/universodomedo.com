export const registerTooltip = (id: number): { type: 'REGISTER_TOOLTIP'; payload: number } => ({
    type: 'REGISTER_TOOLTIP',
    payload: id,
});

export const showTooltip = (payload: { id: number; position: { top: number; left: number } }): { type: 'SHOW_TOOLTIP'; payload: { id: number; position: { top: number; left: number } } } => ({
    type: 'SHOW_TOOLTIP',
    payload,
});

export const hideTooltip = (id: number): { type: 'HIDE_TOOLTIP'; payload: number } => ({
    type: 'HIDE_TOOLTIP',
    payload: id,
});