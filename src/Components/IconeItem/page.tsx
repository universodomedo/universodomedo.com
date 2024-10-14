// #region Imports
import style from "./style.module.css";
import { IconeCustomizadoProps } from "Types/classes.tsx";
// #endregion

const page = ({ quantidadeAgrupada, props, onClick }: { quantidadeAgrupada:number, props: IconeCustomizadoProps, onClick?: () => void }) => {
    return (
        <div className={style.icones_itens}>
            <img src={`data:image/svg+xml;base64,${props.svg}`} onClick={onClick} />
            {quantidadeAgrupada > 1 && (
                <span className={style.quantidade_agrupada}>x2</span>
            )}
        </div>
    );
}

export default page;