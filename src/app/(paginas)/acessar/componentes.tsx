'use client';

import styles from './styles.module.css';

import Image from 'next/image';
import { PAGINAS } from 'types-nora-api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import RedirecionadorInterno from 'Componentes/Elementos/RedirecionadorInterno/RedirecionadorInterno';
import { ControladorSlot } from 'Layouts/ControladorSlot';
import RecipienteArquivoInterno from 'Uteis/ImagemLoader/RecipienteArquivoInterno';

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
        <div className={styles.recipiente_tela_acessar}>
            <RecipienteArquivoInterno arquivo={'CARD_ACESSAR'} />

            <div className={styles.recipente_adicionais}>
                <h1>Acessar</h1>

                <div className={styles.recipiente_botao_acesso_discord}>
                    <FontAwesomeIcon className={styles.botao_acesso_discord} icon={faDiscord} onClick={handleLogin} />
                </div>
            </div>
        </div>
    )
};