// #region Imports
import style from './style.module.css';

import { AuthData } from 'Classes/ClassesTipos/index.ts';

import { Link, useNavigate } from "react-router-dom";

import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useSignOut from 'react-auth-kit/hooks/useSignOut';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserClock, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
// #endregion

const pagina = () => {
    const logado: boolean = useIsAuthenticated();
    const auth = useAuthUser<AuthData>();

    const InfoLogado = () => {
        const signOut = useSignOut();
        const navigate = useNavigate();

        const handleSignOut = () => {
            signOut();

            if (location.pathname === '/inicio') {
                window.location.reload();
            } else {
                navigate('/inicio');
            }
        };

        return (
            <div id={style.logavel}>
                {auth?.visitante ? (
                    <div id={style.imagem_logavel}><FontAwesomeIcon icon={faUserClock} /></div>
                ) : (
                    <div id={style.imagem_logavel}><FontAwesomeIcon icon={faUser} /></div>
                )}
                <div id={style.info_logavel}>
                    <h2>{auth?.usuario}</h2>
                    <h3><FontAwesomeIcon className={style.icone_logout} icon={faRightFromBracket} onClick={handleSignOut} /></h3>
                </div>
            </div>
        );
    }

    const InfoDeslogado = () => {
        return (
            <div id={style.logavel}>
                <Link to="login">
                    <div id={style.info_logavel}>
                        <h2>Acesse</h2>
                        <h3>Para criar um Personagem</h3>
                    </div>
                </Link>
            </div>
        );
    }

    return (
        <>
            {logado ? (
                <InfoLogado/>
            ) : (
                <InfoDeslogado/>
            )}
        </>
    );
}

export default pagina;