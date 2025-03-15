import styles from './styles.module.css';
import Link from 'next/link';

import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';

export default function ComponenteBotaoAcessar() {
    
    return (
        <Link href={'/acessar'}>
            <div id={styles.recipiente_svg_botao_acesso}>
                <ElementoSVG src={"/imagensFigma/botao-acesso-completo.svg"} />
            </div>
        </Link>
    );
};