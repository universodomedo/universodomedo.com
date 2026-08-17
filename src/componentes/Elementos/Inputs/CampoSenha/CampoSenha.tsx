'use client';

import styles from './styles.module.css';

import { useState, type ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

type PropsCampoSenha = { value: string; onChange: (evento: ChangeEvent<HTMLInputElement>) => void; disabled?: boolean; maxLength?: number; placeholder?: string; autoComplete?: string };

/** Input de senha da biblioteca, com alternância mostrar/esconder (ícone de olho). Usar DENTRO do InputComRotulo no lugar do <input type="password"> cru; aceita o spread de formulario.input('campo'). */
export default function CampoSenha({ autoComplete, ...propsInput }: PropsCampoSenha) {
    const [visivel, setVisivel] = useState(false);

    return (
        <div className={styles.recipienteCampoSenha}>
            <input type={visivel ? 'text' : 'password'} autoComplete={autoComplete} {...propsInput} />
            <FontAwesomeIcon className={styles.botaoOlho} icon={visivel ? faEyeSlash : faEye} onClick={() => setVisivel(atual => !atual)} />
        </div>
    );
};