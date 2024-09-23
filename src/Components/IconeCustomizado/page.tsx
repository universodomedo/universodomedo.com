// #region Imports
import style from "./style.module.css";
import { IconeCustomizadoProps } from "Types/classes.tsx";
// #endregion

const page = ({ props }: { props: IconeCustomizadoProps }) => {
    return (
        <div className={`${style.icone_ritual}`} style={{ backgroundImage: `url(data:image/svg+xml;base64,${props.svg})`, backgroundColor: props.corDeFundo }} />
    );
}

export default page;