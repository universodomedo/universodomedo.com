'use client';

import styles from './style.module.css';
import Image from 'next/image';

export default function Acessar() {
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
                    <button onClick={handleLogin} style={{padding: '.6vh'}}>Acessar</button>
                </div>
            </div>
        </div>
    );
};