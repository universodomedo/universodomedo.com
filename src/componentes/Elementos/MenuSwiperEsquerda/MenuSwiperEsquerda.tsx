'use client';

// #region Imports
import styles from './styles.module.css';
import Link from 'next/link';

import { useContextoMenuSwiperEsquerda } from 'Contextos/ContextoMenuSwiperEsquerda/contexto.tsx';
// #endregion

const pagina = () => {
    const { menuAberto, alternaMenuAberto } = useContextoMenuSwiperEsquerda();

    const obterItensMenu = (): { link: string, target: string, titulo: string, }[] => {
        // switch (layout) {
        //     case 'deslogado':
        //         return [
        //             { link: '/inicio', target: '', titulo: 'Pagina Inicial' },
        //             { link: '/ficha-demonstracao', target: '', titulo: 'Ficha Demonstração' },
        //             { link: '/login', target: '', titulo: 'Conectar' },
        //             // { link: '', target: '', titulo: 'Sistema' },
        //             // { link: '', target: '', titulo: 'Ao vivo' },
        //         ];
        //     case 'logado':
        //         return [
        //             { link: '/inicio', target: '', titulo: 'Pagina Inicial' },
        //             { link: '/', target: '', titulo: 'Minha Página' },
        //             // { link: '', target: '', titulo: 'Salas' },
        //             // { link: '', target: '', titulo: 'Sistema' },s
        //             // { link: '', target: '', titulo: 'Ao vivo' },
        //         ];
        //     case 'emjogo':
        //         return [
        //             { link: '/', target: '', titulo: 'Minha Página' },
        //             // { link: , target: '_blank', titulo: 'Sistema' },
        //         ];
        //     default:
        //         return [];
        // };

        return [
            { link: '/', target: '', titulo: 'Início' },
            { link: '/definicoes', target: '', titulo: 'Definições' },
            { link: '/em-jogo', target: '', titulo: 'Ficha de Demonstração' },
            { link: '/minha-pagina', target: '', titulo: 'Minha Página' },
            { link: '/linha-do-tempo', target: '', titulo: 'Linha do Tempo' },
            // { link: '/ficha-demonstracao', target: '', titulo: 'Ficha Demonstração' },
            // { link: '/login', target: '', titulo: 'Conectar' },
            // { link: '', target: '', titulo: 'Sistema' },
            // { link: '', target: '', titulo: 'Ao vivo' },
        ];
    }

    const itensMenu = obterItensMenu();

    return (
        <>
            {menuAberto && <div id={styles.overlay_swiper_esquerda} onClick={alternaMenuAberto}></div>}
            <div id={styles.swiper_esquerda} className={`${menuAberto ? styles.aberto : ''}`}>
                <nav id={styles.nav_swiper_esquerda}>
                    {itensMenu.map((item, index) => (
                        <Link key={index} href={item.link} target={item.target}><h3>{item.titulo}</h3></Link>
                    ))}
                </nav>
            </div>
        </>
    );
}

export default pagina;