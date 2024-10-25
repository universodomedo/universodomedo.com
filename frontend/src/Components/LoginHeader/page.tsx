// #region Imports
import style from './style.module.css';
import { Link } from "react-router-dom";
// #endregion

const page = () => {
    return (
        <div className={style.div_acessar}>
            <div className="nav-connect"><Link to="login">Acessar</Link></div>
        </div>
    );
}

export default page;