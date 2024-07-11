import "./SectionCarroussel.css";
import CarrosselItem from '../../SubComponents/CarrosselItem/CarrosselItem';

import imgCapa1 from "../../Assets/testeCapa1.png";
import imgCapa2 from "../../Assets/testeCapa2.png";
import imgCapa3 from "../../Assets/testeCapa3.png";

const SectionCarroussel = () => {
  return (
    <div className='section'>
        <div className='title'>
            <p>Próximas Sessões</p>
        </div>

        <div className='parenteCarroussel'>
            <CarrosselItem itemTitle={"Apenas uma Prece"} imgUrl={imgCapa1} live={true}/>
            <CarrosselItem itemTitle={"Black Ops"} imgUrl={imgCapa2} live={false}/>
            <CarrosselItem itemTitle={"Antes do Abismo"} imgUrl={imgCapa3} live={false}/>
        </div>
    </div>
  )
}

export default SectionCarroussel;