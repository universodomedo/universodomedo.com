// #region Imports
import style from "./style.module.css";
import { TooltipProps } from "Types/classes.tsx";
import ReferenciaTooltip from "Components/SubComponents/Tooltip/ReferenciaTooltip.tsx";
// #endregion

const page = ({props, tamanho="pequeno"}: {props:TooltipProps, tamanho?: "pequeno" | "grande"}) => {
    return (
        <ReferenciaTooltip objeto={props}>
            <div className={`${style.icone_ritual} ${style[tamanho]} ${style[props.iconeCustomizado.elementoNome]}`} style={{ backgroundImage: `url(data:image/svg+xml;base64,${props.iconeCustomizado.svg})` }}/>
        </ReferenciaTooltip>
    );
}

export default page;