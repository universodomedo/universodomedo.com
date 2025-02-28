// #region Imports
import styles from './styles.module.css';
import Link from 'next/link';

import MenuSwiperEsquerda from 'Componentes/Elementos/MenuSwiperEsquerda/MenuSwiperEsquerda.tsx';

import HamburgerButton from 'Componentes/ElementosVisuais/PaginaAterrissagem/HamburgerButton/HamburgerButton';
import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';
import ElementoSVGAnimado from 'Componentes/Elementos/ElementoSVGAnimado/ElementoSVGAnimado';
import ComponenteBotaoAcessar from 'Componentes/ElementosVisuais/BotaoAcessar/botao-acessar';
// #endregion

export default function SecaoCabecalho() {
    return (
        <div id={styles.cabecalho}>
            <MenuSwiperEsquerda />
            <div id={styles.cabecalho_esquerda}>
                <HamburgerButton />
                <div id={styles.cabecalho_esquerda_logo}>
                    <Link href={'/'}><ElementoSVG src={"/imagensFigma/logo-cabecalho.svg"} /></Link>
                    {/* <Link href={'/'}><ElementoSVGAnimado src={"/imagensFigma/logo-cabecalho.svg"} animacao={{ tipoAnimacao: 'contorno-amarelo', cor: '#000', duracao: 3, intervalo: 2, fadeOutDuracao: 1 }} /></Link> */}
                </div>
            </div>

            <div id={styles.cabecalho_direita}>
                <div id={styles.cabecalho_direita_linha}>
                    <ElementoSVG className={styles.linha_cabecalho} src={"/imagensFigma/linha-cabecalho.svg"} />
                    {/* <ElementoSVGAnimado className={styles.linha_cabecalho} src={"/imagensFigma/linha-cabecalho.svg"} /> */}
                    {/* <Image id={styles.linha_cabecalho} src={"/imagensFigma/linha-cabecalho.svg"} alt='' fill quality={100} /> */}
                </div>
                <div id={styles.cabecalho_direita_acesso}>
                    {/* <ComponenteBotaoAcessar /> */}
                </div>
            </div>
        </div>
    );
};