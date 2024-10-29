// #region Imports
import style from "./style.module.css";
import { TooltipProps } from 'Types/classes/index.ts';
// #endregion

const page = ({ props }: { props: TooltipProps }) => {
    return (
        <div className={style.container_caixa_informacao} style={{ border: `2px ${props.corTooltip.corPrimaria} solid` }}>
            {props.caixaInformacao.cabecalho && (
                <div className={style.cabecalho_caixa_informacao}>
                    {props.caixaInformacao.cabecalho.map((item, index) => {
                        if (item.tipo === 'titulo')
                            return (<span key={index} className={style.titulo} style={{ background: `linear-gradient(0deg, ${props.corTooltip.corSecundaria}, ${props.corTooltip.corPrimaria}, ${props.corTooltip.corSecundaria}) text`, WebkitTextFillColor: 'transparent', WebkitTextStroke: `.4px ${props.corTooltip.corTerciaria}` }}>{item.conteudo}</span>);
                        if (item.tipo === 'subtitulo')
                            return (<span key={index} className={style.subtitulo}>{item.conteudo}</span>);
                    })}
                </div>
            )}

            {props.caixaInformacao.corpo && (
                <div className={style.corpo_caixa_informacao}>
                    {props.caixaInformacao.corpo.map((item, index) => {
                        if (item.tipo === 'texto')
                            return (<span style={{color:item.cor}} key={index}>{item.conteudo}</span>);
                        if (item.tipo === 'separacao')
                            return (<div key={index} className={style.separador}><span className={style.span_separador}>{item.conteudo}</span></div>);
                    })}
                </div>
            )}
        </div>
    );
}

export default page;