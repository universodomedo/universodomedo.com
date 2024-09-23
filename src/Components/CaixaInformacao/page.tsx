// #region Imports
import style from "./style.module.css";
import { TooltipProps } from "Types/classes.tsx";
import IconeCustomizado from "Components/IconeCustomizado/page.tsx";
// #endregion

const page = ({props} : {props: TooltipProps}) => {
    return (
        <div className={style.container_caixa_informacao} style={{border:`2px ${props.corTooltip.corPrimaria} solid`}}>
            <div className={style.cabecalho_caixa_informacao}
                style={{background: `linear-gradient(0deg, ${props.corTooltip.corSecundaria}, ${props.corTooltip.corPrimaria}, ${props.corTooltip.corSecundaria}) text`, WebkitTextFillColor: 'transparent', WebkitTextStroke: `.4px ${props.corTooltip.corTerciaria}`}}>
                {props.caixaInformacao.cabecalho.map((item, index) => (
                    <span key={index}>{item}</span>
                ))}
            </div>

            <div className={style.corpo_caixa_informacao}>
                {props.caixaInformacao.corpo.map((item, index) => (
                    <span key={index}>{item}</span>
                ))}    
            </div>

            <div className={style.rodape_caixa_informacao}>
                {/* <IconeCustomizado elementoNome={"Energia"} title={"Aprimorar Acrobacia"} circuloNivelNome={"1º Círculo Fraco"} svg={"PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Zz4KICAgIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICAgIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgeD0iMzQxIiB5PSIyOTEiIGlkPSJzdmdfMiIgc3Ryb2tlLXdpZHRoPSIwIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPlRlc3RlIDE8L3RleHQ+CiAgICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgeD0iNjMiIHk9IjExMCIgaWQ9InN2Z18zIiBmb250LXNpemU9IjE0MCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5SPC90ZXh0PgogIDwvZz4KPC9zdmc+"}/> */}
            </div>
        </div>
    );
}

export default page;