import style from "./style.module.css";
import ConsultaGenerica from "Components/ConsultaFicha/page.tsx";
import { Ritual } from "Types/classes.tsx";

const page: React.FC<{ rituaisPersonagem: Ritual[] }> = ({ rituaisPersonagem }) => {
  const filterConfig = Ritual.getFilterConfig();

  const svgBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Zz4KICAgIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICAgIDx0ZXh0IGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMCIgeD0iMzQxIiB5PSIyOTEiIGlkPSJzdmdfMiIgc3Ryb2tlLXdpZHRoPSIwIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iTm90byBTYW5zIEpQIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIHhtbDpzcGFjZT0icHJlc2VydmUiPlRlc3RlIDE8L3RleHQ+CiAgICA8dGV4dCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgeD0iNjMiIHk9IjExMCIgaWQ9InN2Z18zIiBmb250LXNpemU9IjE0MCIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucyBKUCIgdGV4dC1hbmNob3I9InN0YXJ0IiB4bWw6c3BhY2U9InByZXNlcnZlIj5SPC90ZXh0PgogIDwvZz4KPC9zdmc+';

  const sortOptions = [
    { label: "Nome", value: "nome" as keyof Ritual },
    { label: "Elemento", value: "refElemento" as keyof Ritual },
  ];

  const renderRitualItem = (ritual: Ritual, index: number) => (
    <div
      key={index}
      className={`${style.icone_ritual} ${style[ritual.refElemento.nome]}`}
      style={{ backgroundImage: `url(${svgBase64})` }}
      data-hoverbox-content={JSON.stringify({
        title: ritual.nome,
        description: `${ritual.refElemento.nome} - ${ritual.circuloNivelRitual.nome}`,
      })}
    />
  );

  return (
    <ConsultaGenerica<Ritual>
      data={rituaisPersonagem}
      renderItem={renderRitualItem}
      filterConfig={filterConfig}
      sortOptions={sortOptions}
    />
  );
};

export default page;