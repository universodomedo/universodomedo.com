// #region Imports
import style from "./style.module.css";
// #endregion

const page = ({ valoresSelecionados } : { valoresSelecionados:string[] }) => {
    return (
        <div className={style.div_teste}>
            {valoresSelecionados.map((valorSelecionado, index) => (
                <ValorSelecionado key={index} valorSelecionado={valorSelecionado}/>
            ))}
        </div>
    );
}

const ValorSelecionado = ({ valorSelecionado, handleRemoveValue }: { valorSelecionado:string, handleRemoveValue?: (e: React.MouseEvent<HTMLDivElement>) => void }) => {
    return (
        <div className={style.value_container}>
            <div className={style.value}>{valorSelecionado}</div>
            <BotaoFechar />
        </div>
    )
}

const BotaoFechar = ({ id, onClick }: { id?: string; onClick?: (e: React.MouseEvent<HTMLDivElement>) => void }) => {
    const svg = "M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z";

    return (
        <div className={style.button_x} id={id} onClick={onClick} ><svg width={14} height={14} viewBox="0 0 20 20"><path d={svg}></path></svg></div>
    );
}

export default page;