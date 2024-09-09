import "./style.css";
import { Link } from "react-router-dom";
import logo from "Components/Assets/logo.png";

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
          <Link to="/ficha-demo">Demo</Link>
        </ul>
      </nav>

      <div className="header-acessar">
        {/* <Link to="login"><div className="nav-connect">Acessar</div></Link> */}
      </div>

    </div>
  )
}

export default LPHeader;