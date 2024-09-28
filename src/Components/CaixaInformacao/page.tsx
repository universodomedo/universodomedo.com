// #region Imports
import style from "./style.module.css";
import { TooltipProps } from "Types/classes.tsx";
// #endregion

const page = ({ props }: { props: TooltipProps }) => {
    return (
        <div className={style.container_caixa_informacao} style={{ border: `2px ${props.corTooltip.corPrimaria} solid` }}>
            <div className={style.cabecalho_caixa_informacao} style={{ background: `linear-gradient(0deg, ${props.corTooltip.corSecundaria}, ${props.corTooltip.corPrimaria}, ${props.corTooltip.corSecundaria}) text`, WebkitTextFillColor: 'transparent', WebkitTextStroke: `.4px ${props.corTooltip.corTerciaria}` }}>
                {props.caixaInformacao.cabecalho.map((item, index) => (
                    <span key={index}>{item}</span>
                ))}
            </div>

            <div className={style.corpo_caixa_informacao}>
                {props.caixaInformacao.corpo.map((item, index) => {
                    if (item.tipo === 'texto')
                        return (<span key={index}>{item.conteudo}</span>);
                    if (item.tipo === 'separacao')
                        return (<hr key={index} />);
                })}
            </div>
        </div>
    );
}

export default page;