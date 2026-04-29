'use client';

import styles from './styles.module.css';

import useScrollable from 'Componentes/ElementosVisuais/ElementoScrollable/useScrollable';
import { style } from 'd3-selection';

import Image from "next/image";

export default function SecaoPosts() {
    const { scrollableProps } = useScrollable();

    return (
        <div id={styles.recipiente_lista_posts} {...scrollableProps}>
            <h1>Nenhuma postagem encontrada</h1>
            <div className={styles.div_imagens}>
                {/* Avatar Arthur */}
                <Image alt='' src={'https://cdn.universodomedo.com/RecursosPublicos/avatar_personagem/83a07acd-f97c-4c96-8573-e51ddc3baa17.webp'} fill unoptimized />
            </div>

            <div className={styles.div_imagens}>
                {/* Moldura */}
                <Image alt='' src={'https://cdn.universodomedo.com/RecursosInternos/a58d8d62-8e8c-44ce-af07-0d1019659f69.webp'} fill unoptimized />
            </div>

            <div className={styles.div_imagens}>
                {/* Bola Amarela */}
                <Image alt='' src={'https://cdn.universodomedo.com/RecursosInternos/6bfaeb00-e67f-4452-a08c-303125ab5687.webp'} fill unoptimized />
            </div>

            <div className={styles.div_imagens}>
                {/* Capa */}
                <Image alt='' src={'https://cdn.universodomedo.com/RecursosPublicos/imagem_especial_artista/7b1822c9-a109-4eea-a28d-382fa8f28f59.webp'} fill unoptimized />
            </div>

            <div className={styles.div_imagens}>
                {/* Moldura Emblema */}
                <Image alt='' src={'https://cdn.universodomedo.com/RecursosInternos/cf6b0e14-7b4d-4c78-9d06-f7de03ede14c.webp'} fill unoptimized />
            </div>

            <div className={styles.div_imagens}>
                {/* Fundo Usuario */}
                <Image alt='' src={'https://cdn.universodomedo.com/RecursosInternos/0fc088a2-b0a2-45e5-8984-6b2e2700cc16.webp'} fill unoptimized />
            </div>

            <div className={styles.div_imagens}>
                {/* Fundo Conquistas */}
                <Image alt='' src={'https://cdn.universodomedo.com/RecursosInternos/b24a3d4a-2235-4f87-848f-545a3eba1d37.webp'} fill unoptimized />
            </div>

            <div className={styles.div_imagens}>
                {/* Plus */}
                <Image alt='' src={'https://cdn.universodomedo.com/RecursosInternos/ecf42e92-34e5-4733-854e-b7683f3b1687.webp'} fill unoptimized />
            </div>

            <div className={styles.div_imagens}>
                {/* Fundo Placeholder */}
                <Image alt='' src={'https://cdn.universodomedo.com/RecursosInternos/735355b4-f9ea-4e94-9fe5-88201f417cfd.webp'} fill unoptimized />
            </div>

            <div className={styles.div_imagens}>
                {/* Borda Usuario */}
                <Image alt='' src={'https://cdn.universodomedo.com/RecursosInternos/d577195e-3f56-4af2-96d2-8c5e9b8bcdc5.webp'} fill unoptimized />
            </div>

            <div className={styles.div_imagens}>
                {/* Estrela */}
                <Image alt='' src={'https://cdn.universodomedo.com/RecursosInternos/de695432-52f7-4742-97f6-58bd2f630bcd.svg'} fill unoptimized />
            </div>

            <div className={styles.div_imagens}>
                {/* Emblema Fundador PNG */}
                <Image alt='' src={'https://cdn.universodomedo.com/RecursosInternos/1adfb703-1701-4b8f-9b75-fa6f30fdfb8a.webp'} fill unoptimized />
            </div>

            <div className={styles.div_imagens}>
                {/* Emblema Fundador SVG */}
                <Image alt='' src={'https://cdn.universodomedo.com/RecursosInternos/0dc7b398-4c7c-4824-8e97-fdc88c15f245.svg'} fill unoptimized />
            </div>

            {/* <Image alt='' src={''} fill unoptimized className={className} /> */}
        </div>
    );
};

// export default function SecaoPosts() {
//     return (
//         <div className={styles.recipiente_post}>
//             <div className={styles.post_parte_superior}>
//                 <div className={styles.recipiente_imagem_personagem}>
//                     <Image alt='' src={'/imagem-perfil-vazia.png'} fill />
//                 </div>
//                 <div className={styles.recipiente_imagem_personagem}>
//                     <Image alt='' src={'/imagem-perfil-vazia.png'} fill />
//                 </div>
//                 <div className={styles.recipiente_imagem_personagem}>
//                     <Image alt='' src={'/imagem-perfil-vazia.png'} fill />
//                 </div>
//                 <div className={styles.recipiente_imagem_personagem}>
//                     <Image alt='' src={'/imagem-perfil-vazia.png'} fill />
//                 </div>
//                 <h1>Apenas uma Prece: Aventura Finalizada!</h1>
//             </div>

//             <div className={styles.post_parte_inferior}>
//                 <div className={styles.recipiente_imagem_post}>
//                     <Image alt='' src={'/testeCapa1.png'} fill />
//                 </div>
//                 <div className={styles.recipiente_informacoes_parte_inferior}>
//                     <div className={styles.recipiente_informacoes_cabecalho}>
//                         <h1>A Sinfonia da Vida e da Morte, o Fim do Devoto, o nascimento da Ruína</h1>
//                     </div>
//                     <div className={styles.recipiente_informacoes_corpo}>
//                         <p>Acompanhe o fim dessa saga</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };