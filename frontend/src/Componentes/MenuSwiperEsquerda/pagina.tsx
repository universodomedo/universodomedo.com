// #region Imports
import style from './style.module.css';

import { Link } from 'react-router-dom';

import { useContextoMenuSwiper } from 'Contextos/ContextoMenuSwiper/contexto.tsx'
// #endregion

const pagina = ({ layout }: { layout: 'deslogado' | 'logado' | 'emjogo' }) => {
    const { menuAberto, alternaMenuAberto } = useContextoMenuSwiper();

    const obterItensMenu = (): { link: string, target: string, titulo: string, }[] => {
        switch (layout) {
            case 'deslogado':
                return [
                    { link: '/inicio', target: '', titulo: 'Pagina Inicial' },
                    { link: '/ficha-demonstracao', target: '', titulo: 'Ficha Demonstração' },
                    { link: '/login', target: '', titulo: 'Conectar' },
                    // { link: '', target: '', titulo: 'Sistema' },
                    // { link: '', target: '', titulo: 'Ao vivo' },
                ];
            case 'logado':
                return [
                    { link: '/inicio', target: '', titulo: 'Pagina Inicial' },
                    { link: '/', target: '', titulo: 'Minha Página' },
                    // { link: '', target: '', titulo: 'Salas' },
                    // { link: '', target: '', titulo: 'Sistema' },s
                    // { link: '', target: '', titulo: 'Ao vivo' },
                ];
            case 'emjogo':
                return [
                    { link: '/', target: '', titulo: 'Minha Página' },
                    // { link: , target: '_blank', titulo: 'Sistema' },
                ];
            default:
                return [];
        };
    }

    const itensMenu = obterItensMenu();

    return (
        <>
            {menuAberto && <div id={style.overlay_swiper_esquerda} onClick={alternaMenuAberto}></div>}
            <div id={style.swiper_esquerda} className={`${menuAberto ? style.aberto : ''}`}>
                <nav id={style.nav_swiper_esquerda}>
                    {itensMenu.map((item, index) => (
                        <Link key={index} to={item.link} target={item.target}><h3>{item.titulo}</h3></Link>
                    ))}
                </nav>
            </div>
        </>
    );
}

export default pagina;