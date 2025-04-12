'use client';

import styles from './styles.module.css';
import Link from 'next/link';

import ElementoSVG from 'Componentes/Elementos/ElementoSVG/ElementoSVG.tsx';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';

export default function ComponenteBotaoAcessar() {
    const { usuarioLogado } = useContextoAutenticacao();

    return (
        <Link href={usuarioLogado ? '/minha-pagina' : '/acessar'}>
            <div id={styles.recipiente_svg_botao_acesso}>
                <ElementoSVG src={"/imagensFigma/botao-acesso-completo.svg"} />
            </div>
        </Link>
    );
};