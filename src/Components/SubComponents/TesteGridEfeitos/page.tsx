// #region Imports
import { useState } from "react";
import style from "./style.module.css";
import { Buff } from "Types/classes.tsx";
import Tooltip from "Components/SubComponents/Tooltip/page.tsx";
// #endregion

// interface GridEfeitos { lista:BonusConectado[]; }

const page: React.FC<{ buffs:Buff[] }> = ({buffs}) => {
  const [hoveredBuffId, setHoveredBuffId] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (id: number, event: React.MouseEvent) => {
    setHoveredBuffId(id);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredBuffId(null);
  };
  
// const page: React.FC<GridEfeitos> = ({lista}) => {
  const svg = `url(data:image/svg+xml,%3Csvg%20height%3D%22800%22%20width%3D%22800%22%20version%3D%221.1%22%20id%3D%22_x32_%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20xml%3Aspace%3D%22preserve%22%3E%3Cstyle%3E.st0%7Bfill%3A%23000%7D%3C%2Fstyle%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M180.4%20212.472c-24.094%2041.731-9.789%2095.104%2031.95%20119.214%2041.731%2024.086%2095.112%209.789%20119.214-31.95%2024.094-41.739%209.789-95.112-31.95-119.214-41.732-24.094-95.105-9.797-119.214%2031.95%22%2F%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M188.113%20373.664c-21.399-12.349-38.122-29.708-49.636-49.715l-.048.024L29.943%20136.087C-34.49%20257.272%208.187%20408.636%20127.981%20477.802c26.893%2015.521%2055.432%2025.612%2084.345%2030.598l68.696-118.976c-30.789%205.805-63.718%201.106-92.909-15.76m-49.691-185.436c25.072-43.433%2070.692-67.734%20117.56-67.814v-.055H473.02c-21.478-34.423-51.448-64.243-89.037-85.952C274.43-28.842%20137.595-1.862%2059.357%2092.233l68.592%20118.793c2.752-7.77%206.194-15.403%2010.473-22.798m357.8-20.469H359.029c36.38%2042.51%2044.053%20105.076%2014.512%20156.213L265.047%20511.914c85.156-3.109%20166.885-48.57%20212.632-127.81%2039.512-68.441%2043.807-147.546%2018.543-216.345%22%2F%3E%3C%2Fsvg%3E)`;
  // const svg = lista[0].simboloEfeito.toSvg();

  return (
    <div className={style.buffs_ativos}>
      {
        <>
          {buffs.map((buff, index) => (
            <div key={index} className={style.icone_efeito} 
            data-hoverbox-content={JSON.stringify({
              title: `Buff ${buff.idBuff}`,
              description: `Valor: ${buff.valor}`,
              customField: 'Valor especial'
            })}
            >
              {/* style={{backgroundImage: svg, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'} */}
              {/* {hoveredBuffId === buff.idRefBuff && (
                <Tooltip x={mousePosition.x} y={mousePosition.y}>
                  <p>ID: {buff.idRefBuff}</p>
                  <p>Valor: {buff.valor}</p>
                </Tooltip>
              )} */}
            </div>
              // <div key={index} className="effect" style={{backgroundImage: svg,
              // backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}></div>
              // <div key={index} className="effect" style={{backgroundImage: `url(${efeito.simboloEfeito.toSvg()})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}></div>
          ))}
                {/* {lista.filter(efeito => efeito.checked).map((efeito, index) => (
                    <div key={index} className="effect" style={{backgroundImage: svg,
                    backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}></div>
                    // <div key={index} className="effect" style={{backgroundImage: `url(${efeito.simboloEfeito.toSvg()})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}></div>
                ))} */}
        </>
      }
    </div>
  )
}

export default page;