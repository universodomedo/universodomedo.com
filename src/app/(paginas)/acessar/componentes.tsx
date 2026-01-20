'use client';

import styles from './styles.module.css';

import Image from 'next/image';
import { PAGINAS } from 'types-nora-api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import RedirecionadorInterno from 'Componentes/Elementos/RedirecionadorInterno/RedirecionadorInterno';
import { ControladorSlot } from 'Layouts/ControladorSlot';

export function PaginaAcessar_Client() {
    const { estaAutenticado } = useContextoAutenticacao();

    if (estaAutenticado) return <RedirecionadorInterno pagina={PAGINAS.minhaPagina} />

    return (
        <ControladorSlot pagina={PAGINAS.acessar}>
            <PaginaAcessar_Slot />
        </ControladorSlot>
    );
};

function PaginaAcessar_Slot() {
    const handleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`;
    };

    return (
        <div id={styles.recipiente_tela_acessar}>
            <div id={styles.recipiente_imagem_fundo_acessar}>
                <Image src={'/imagensFigma/bg-acessar.png'} alt='' fill quality={100} />
            </div>

            <div id={styles.recipiente_formulario_acesso}>
                <Image src={'/imagensFigma/bg-form-acesso.png'} alt='' fill quality={100} />
                <div id={styles.recipiente_conteudo_formulario_acesso}>
                    <h1>Acessar</h1>
                    <div id={styles.recipiente_botao_acesso_discord}>
                        <FontAwesomeIcon id={styles.botao_acesso_discord} icon={faDiscord} onClick={handleLogin} />
                    </div>
                </div>
            </div>
        </div>
    );
};