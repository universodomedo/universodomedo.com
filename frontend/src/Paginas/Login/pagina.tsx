// #region Imports
import style from './style.module.css';
import { useState } from 'react';

import { AuthData } from 'Classes/ClassesTipos/index.ts';

import { SignJWT } from 'jose';
import useSignIn from 'react-auth-kit/hooks/useSignIn';

import { useNavigate } from 'react-router-dom';
// #endregion

const page = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const signIn = useSignIn();
    const navigate = useNavigate();

    const logaVisitante = async (event: React.FormEvent) => {
        event.preventDefault();

        const chaveSecreta = new TextEncoder().encode('minha-chave-secreta');

        const token = await new SignJWT({ usuario: 'Visitante' })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1d')
            .sign(chaveSecreta);

        const userState: AuthData = {
            usuario: 'Visitante',
            admin: false,
            visitante: true,
        };

        signIn({
            auth: {
                token: token,
                type: 'Bearer',
            },
            userState: userState
        });

        navigate('/');
    }

    return (
        <form id={style.formulario_login}>
            <div id={style.recipiente_login}>
                <div id={style.recipiente_titulo}><h1>Acessar</h1></div>

                <div id={style.recipiente_input_field}>
                    <button onClick={(e) => {logaVisitante(e)}}>Visitante</button>
                </div>
            </div>
        </form>
    )
}

export default page;