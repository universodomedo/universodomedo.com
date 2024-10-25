import styles from "./style.module.css";
import { Outlet } from "react-router-dom";

const LayoutInterno = () => {
    return (
      <>
        <div className={styles.header}></div>
        <div className={styles.content}>
          <aside className={styles.asides}></aside>
          <main className={styles.main}>
            <Outlet />
          </main>
          <aside className={styles.asides}></aside>
        </div>
      </>
    );
};

export default LayoutInterno;