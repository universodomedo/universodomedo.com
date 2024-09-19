// #region Imports
import ReferenciaTooltip from "Components/SubComponents/Tooltip/ReferenciaTooltip";
import style from "./style.module.css";
import { Acao } from "Types/classes.tsx";
// #endregion

const page: React.FC<{acoesPersonagem:Acao[]}> = ({ acoesPersonagem }) => {
  const svgBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHg9IjM0MSIgeT0iMjkxIiBpZD0ic3ZnXzIiIHN0cm9rZS13aWR0aD0iMCIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5UZXN0ZSAxPC90ZXh0PgogIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwIiB4PSI1MyIgeT0iMTA5IiBpZD0ic3ZnXzMiIGZvbnQtc2l6ZT0iMTQwIiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPkE8L3RleHQ+CjwvZz4KPC9zdmc+';

  return (
    <div className={style.conteudo_acoes}>
      <h1>Ações</h1>
        
      <div className={style.div_acoes}>
        {acoesPersonagem.map((acao, index) => (
          <ReferenciaTooltip objeto={acao.tooltipProps}>
            <div
              key={index}
              className={`${style.icone_habilidade} ${!acao.verificaCustoPodeSerPagado ? style.acao_bloqueada : ''}`}
              style={{backgroundImage: `url(${svgBase64})`}}
              data-hoverbox-content={JSON.stringify({
                title: `${acao.nome}`
              })}
              onClick={() => {acao.executa()}}
            />
          </ReferenciaTooltip>
        ))}
      </div>
    </div>
  )
};
  
export default page;