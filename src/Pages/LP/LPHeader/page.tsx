import "./style.css";
import { Link } from "react-router-dom";
import logo from "Components/Assets/logo.png";

const LPHeader = () => {
  return (
    <div className='header'>
      <div className='navbar'>
        <Link to="/"><img src={logo} alt="" /></Link>
        <ul className="nav-menu">
          <Link to="/"><li>Início</li></Link>
          <Link to=""><li>Sessões</li></Link>
          <Link to=""><li>Ao Vivo</li></Link>
          <Link to=""><li>Sistema</li></Link>
          <Link to=""><li>Redes Sociais</li></Link>
        </ul>
        <div className="nav-connect">Acessar</div>
      </div>
    </div>
  )
}

export default LPHeader;