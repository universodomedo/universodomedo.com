import style from "./style.module.css";
import img from 'Assets/testeCapa1.png'

const Pagina = () => {
    return (
        <>
            <div className={style.tela_principal} style={{ backgroundImage: `url(${img})` }} />
        </>
    );
};

export default Pagina;