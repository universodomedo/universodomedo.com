import "./style.css";
import { Outlet } from "react-router-dom";

const LayoutPG = () => {
  return (
    <main className="layout-lp">
      <Outlet />
    </main>
  );
};

export default LayoutPG;