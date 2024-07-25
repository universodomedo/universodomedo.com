import "./style.css";
import { Outlet } from "react-router-dom";

const LayoutInterno = () => {
    return (
      <>
        <aside></aside>
        <main className="layout-interno">
            <Outlet />
        </main>
        <aside></aside>
      </>
    );
};

export default LayoutInterno;