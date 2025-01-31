// #region Imports
import style from './style.module.css';

import { Link } from 'react-router-dom';

import { useContextoMenuSwiper } from 'Contextos/ContextoMenuSwiper/contexto.tsx'
// #endregion

const pagina = () => {
    const { menuAberto, alternaMenuAberto } = useContextoMenuSwiper();

    return (
        <>
            {menuAberto && <div id={style.overlay_swiper_esquerda} onClick={alternaMenuAberto}></div>}
            <div id={style.swiper_esquerda} className={`${menuAberto ? style.aberto : ''}`}>
                <nav id={style.nav_swiper_esquerda}>
                    {/*
                    Deslogado
                    <Link to='/inicio'><h3>Pagina Inicial</h3></Link>
                    <Link to='/ficha-demonstracao'><h3>Ficha Demonstração</h3></Link>
                    <Link to='/login'><h3>Conectar</h3></Link>
                    <Link to=''><h3>Sistema</h3></Link>
                    <Link to=''><h3>Ao vivo</h3></Link>
                    */}

                    {/*                     
                    Logado
                    <Link to='/inicio'><h3>Pagina Inicial</h3></Link>
                    <Link to='/'><h3>Minha Página</h3></Link>
                    <Link to=''><h3>Salas</h3></Link>
                    <Link to=''><h3>Sistema</h3></Link>
                    <Link to=''><h3>Ao vivo</h3></Link>
                    */}

                    {/*
                    Em jogo
                    <Link to='' target='_blank'><h3>Sistema</h3></Link>
                    */}
                    <Link to='/'><h3>Minha Página</h3></Link>
                </nav>
            </div>
        </>
    );
}

export default pagina;