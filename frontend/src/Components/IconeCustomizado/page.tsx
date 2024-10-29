// #region Imports
import style from "./style.module.css";
import { IconeCustomizadoProps } from 'Types/classes/index.ts';
// #endregion

const page = ({ props, onClick }: { props?: IconeCustomizadoProps, onClick?: () => void }) => {
    return (
        <>
            {props &&(
                <div className={`${style.icone}`} style={{ backgroundImage: `url(data:image/svg+xml;base64,${props.svg})`, backgroundColor: props.corDeFundo }} onClick={onClick}/>
            )}
        </>
    );
}

export default page;