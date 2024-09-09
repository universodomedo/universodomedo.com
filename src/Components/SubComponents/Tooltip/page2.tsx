// #region Imports
import { ReactNode } from "react";
import style from "./style.module.css";
// #endpoint

const page: React.FC<{ x: number, y: number, children: ReactNode }> = ({ x, y, children }) => {
  return (
    <div
      className={style.tooltip}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        transform: 'translate(-50%, -100%)', // Centraliza horizontalmente e coloca acima do mouse
        pointerEvents: 'none', // Faz com que a tooltip não interfira nos eventos de mouse
      }}
    >
      {children}
    </div>
  )
}

export default page;