// #region Imports
import style from './style.module.css';

import { useContextoMenuSwiper } from 'Contextos/ContextoMenuSwiper/contexto.tsx'
// #endregion

const page = () => {
    const { menuAberto, alternaMenuAberto } = useContextoMenuSwiper();

    return (
        <>
            {menuAberto && <div id={style.overlay_swiper_esquerda} onClick={alternaMenuAberto}></div>}
            <div id={style.swiper_esquerda} className={`${menuAberto ? style.swiper_esquerda_aberto : ''}`}>
                <nav>
                    <p>Link 1</p>
                    <p>Link 2</p>
                    <p>Link 3</p>
                </nav>
            </div>
        </>
    );
}

export default page;