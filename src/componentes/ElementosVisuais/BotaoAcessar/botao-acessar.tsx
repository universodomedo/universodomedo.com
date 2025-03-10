import styles from './styles.module.css';
import Link from 'next/link';

import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';

export default function ComponenteBotaoAcessar() {
    
    return (
        <Link href={'/acessar'}>
            <div id={styles.recipiente_svg_botao_acesso}>
                <ElementoSVG className={styles.linha_cabecalho} src={"/imagensFigma/botao-acesso-completo.svg"} />
            </div>
        </Link>
    );

    // return (
    //     <div id={styles.recipiente_svg_botao_acesso}>
    //         <ElementoSVG className={styles.linha_cabecalho} src={"/imagensFigma/botao-acesso-completo.svg"} />
    //         <ElementoSVG className={styles.linha_cabecalho} src={"/imagensFigma/botao-acesso-camada-1.svg"} />
    //         <div id={styles.recipiente_botao_acesso}>
    //             <ElementoSVG className={styles.linha_cabecalho} src={"/imagensFigma/botao-acesso-camada-2.svg"} />
    //         </div>
    //         <div id={styles.recipiente_botao_acesso_efeitos}>
    //             <ElementoSVG className={styles.linha_cabecalho} src={"/imagensFigma/botao-acesso-camada-hover.svg"} />
    //         </div>
    //     </div>
    // );
};