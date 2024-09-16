import style from "./style.module.css";
import ConsultaGenerica from "Components/ConsultaFicha/ConsultaGenerica";
import { Ritual } from "Types/classes.tsx";
import CaixaInformacao from "Components/CaixaInformacao/page.tsx";

const page: React.FC<{ rituaisPersonagem: Ritual[] }> = ({ rituaisPersonagem }) => {
  const filterConfig = Ritual.obterFiltroOrdenacao();

  const renderRitualItem = (ritual: Ritual, index:number) => (
    <div
      key={index}
      className={`${style.icone_ritual} ${style[ritual.refElemento.nome]}`}
      style={{ backgroundImage: `url(data:image/svg+xml;base64,${ritual.svg})` }}
      data-hoverbox-content={JSON.stringify({
        title: ritual.nome,
        description: `${ritual.refElemento.nome} - ${ritual.circuloNivelRitual.nome}`,
      })}
    />
  );

  return (
    <>
      <ConsultaGenerica
        data={rituaisPersonagem}
        filterSortConfig={Ritual.obterFiltroOrdenacao()}
        renderItem={renderRitualItem}
      />

      <CaixaInformacao />
    </>
  );
};

export default page;