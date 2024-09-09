// #region Imports
import "./style.css";
import style from "./style.module.css";
import { Outlet } from "react-router-dom";
// #endregion

const LayoutPG = () => {
  return (
    <main className={style.layout_lp}>
      <Outlet />
    </main>
  );
};

export default LayoutPG;