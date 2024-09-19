// #region Imports
import style from "./style.module.css";
import { IconeCustomizadoProps } from "Types/classes.tsx";
// #endregion

const page = ({props, tamanho="pequeno"}: {props:IconeCustomizadoProps, tamanho?: "pequeno" | "grande"}) => {
    return (
        <div className={`${style.icone_ritual} ${style[tamanho]} ${style[props.elementoNome]}`} style={{ backgroundImage: `url(data:image/svg+xml;base64,${props.svg})` }}/>
    );
}

export default page;