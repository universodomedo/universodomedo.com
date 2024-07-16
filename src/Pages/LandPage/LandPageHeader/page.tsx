import "./style.css";
import { Link } from "react-router-dom";
import logo from "Components/Assets/logo.png";

const LandPageHeader = () => {
  return (
    <div className='header'>
      <div className='navbar'>
        <Link to="/"><img src={logo} alt="" /></Link>
        <ul className="nav-menu">
          <li>Home</li>
        </ul>
        <div className="nav-connect">Acessar</div>
      </div>
    </div>
  )
}

export default LandPageHeader;