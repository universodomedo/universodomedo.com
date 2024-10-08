import styles from "./style.module.css";
import { Outlet } from "react-router-dom";

const LayoutInterno2 = () => {
    return (
      <>
        <div className={styles.content}>
          <main className={styles.main}>
            <div className={styles.alpha_warning}>
              Atenção! Conteúdo em Alpha<br />
              Versões posteriores podem diferir da atual
            </div>

            <Outlet />
          </main>
        </div>
      </>
    );
};

export default LayoutInterno2;