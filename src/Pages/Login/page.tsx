// #region Imports
import style from './style.module.css';
import { useState } from 'react';

import { SignJWT } from 'jose';
import useSignIn from 'react-auth-kit/hooks/useSignIn';

import { useNavigate } from 'react-router-dom';
// #endregion

const page = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const signIn = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if ((username === 'jogador' && password === 'udm') || (username === 'mestre' && password == '!udm!')) {
      const chaveSecreta = new TextEncoder().encode('minha-chave-secreta');
  
      const token = await new SignJWT({ usuario: username })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1d')
        .sign(chaveSecreta);

      signIn({
        auth: {
          token: token,
          type: 'Bearer',
        },
        userState: {
          usuario: username,
          admin: username === 'mestre'
        }
      });

      navigate('/pagina-interna');
    } else {
      alert('Acesso negado');
    }
  }

  return (
    <div className={style.login_container}>
        <h1>Login</h1>
        <form onSubmit={onSubmit} className={style.login_fields}>
          <div>
            <h2>Usuário</h2>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
          </div>

          <div>
            <h2>Senha</h2>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          
        <button type="submit">Entrar</button>

        </form>
    </div>
  )
}

export default page;