// #region Imports
import styles from "./style.module.css";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
// #endregion

const LayoutInterno2 = () => {
    return (
      <>
        <div className={styles.content}>
          <main className={styles.main}>
            <div className={styles.avisos}>
              <div className={styles.voltar}>
                <Link to="/pagina-interna">{'< voltar'}</Link>
              </div>
              <div className={styles.aviso_beta}>
                Versão Beta: 0.2.2<br />
                Versões posteriores podem diferir da atual
              </div>
            </div>

            <Outlet />
          </main>
        </div>
      </>
    );
};

export default LayoutInterno2;