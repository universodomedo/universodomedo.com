let currentTooltipId = 1;

export const generateTooltipId = (): number => {
    return currentTooltipId++;
};