// #region Imports
import "./style.css";
import style from './style.module.css';
import { Link } from "react-router-dom";
import logo from "Components/Assets/logo.png";
// #endregion

const LPHeader = () => {
  return (
    <div className='header'>

      <div className="header-logo">
        <Link to="/"><img src={logo} alt="" /></Link>
      </div>

      <nav>
        <ul className="nav-menu">
          {/* <Link to="/"><li>Início</li></Link>
          <Link to=""><li>Sessões</li></Link>
          <Link to=""><li>Meu Acesso</li></Link>
          <Link to=""><li>Sistema</li></Link>
          <Link to=""><li>Redes Sociais</li></Link> */}
          <Link to="/ficha-demo" className="link-demo">Demonstração</Link>
          <Link to="/tutorial-ficha" className="link-tuto">Tutorial</Link>
        </ul>
      </nav>

      <div className="header-acessar">
        <div className={style.div_acessar}>
        <div className="nav-connect"><Link to="login">Acessar</Link></div>
        </div>
      </div>

    </div>
  )
}

export default LPHeader;