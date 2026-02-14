import { MomentoFormatado24 } from "types-nora-api";

export function isMomentoFormatado24(v: string): v is MomentoFormatado24 {
    if (!/^\d{2}:\d{2}$/.test(v)) return false;

    const [hhStr, mmStr] = v.split(':');
    const hh = Number(hhStr);
    const mm = Number(mmStr);

    return Number.isInteger(hh) && Number.isInteger(mm) && hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59;
};