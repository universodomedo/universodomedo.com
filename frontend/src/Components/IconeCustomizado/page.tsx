// #region Imports
import style from "./style.module.css";
import { IconeCustomizadoProps } from "Types/classes.tsx";
// #endregion

const page = ({ props, onClick }: { props: IconeCustomizadoProps, onClick?: () => void }) => {
    return (
        <div
            className={`${style.icone}`}
            style={{ backgroundImage: `url(data:image/svg+xml;base64,${props.svg})`, backgroundColor: props.corDeFundo }}
            onClick={onClick}
        />
    );
}

export default page;