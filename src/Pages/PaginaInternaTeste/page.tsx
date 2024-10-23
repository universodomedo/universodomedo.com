// #region Imports
import style from './style.module.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { RLJ_Ficha2 } from 'Types/classes.tsx';

import { resetaDemo } from "Redux/slices/fichaHelperSlice.ts";
import store from 'Redux/store.ts';
// #endregion

const page = () => {
    const navigate = useNavigate();

    useEffect(() => {
        store.dispatch(resetaDemo());
    }, []);

    const vaiPraEdicaoFicha = () => {
        localStorage.removeItem('dadosFicha');
        navigate('/edita-ficha');
    }

    const vaiPraFicha = () => {
        const teste:RLJ_Ficha2 = {
            detalhes: {
                nome: 'Rui',
                idClasse: 1,
                idNivel: 2,
            },
            estatisticasDanificaveis: [
                {
                    id: 1,
                    valorMaximo: 10,
                    valor: 10,
                },
                {
                    id: 2,
                    valorMaximo: 8,
                    valor: 8,
                },
                {
                    id: 3,
                    valorMaximo: 4,
                    valor: 4,
                },
            ],
            estatisticasBuffaveis: [],
            atributos: [
                {
                    id: 1,
                    valor: 2,
                },
                {
                    id: 2,
                    valor: 2,
                },
                {
                    id: 3,
                    valor: 2,
                },
                {
                    id: 4,
                    valor: 2,
                },
                {
                    id: 5,
                    valor: 2,
                },
            ],
            periciasPatentes: [
                {
                    idPericia: 1,
                    idPatente: 3,
                },
                {
                    idPericia: 2,
                    idPatente: 3,
                },
                {
                    idPericia: 3,
                    idPatente: 3,
                },
                {
                    idPericia: 4,
                    idPatente: 3,
                },
                {
                    idPericia: 5,
                    idPatente: 3,
                },
                {
                    idPericia: 6,
                    idPatente: 3,
                },
                {
                    idPericia: 7,
                    idPatente: 3,
                },
                {
                    idPericia: 8,
                    idPatente: 3,
                },
                {
                    idPericia: 9,
                    idPatente: 3,
                },
                {
                    idPericia: 10,
                    idPatente: 3,
                },
                {
                    idPericia: 11,
                    idPatente: 3,
                },
                {
                    idPericia: 12,
                    idPatente: 3,
                },
                {
                    idPericia: 13,
                    idPatente: 3,
                },
                {
                    idPericia: 14,
                    idPatente: 3,
                },
                {
                    idPericia: 15,
                    idPatente: 3,
                },
                {
                    idPericia: 16,
                    idPatente: 3,
                },
                {
                    idPericia: 17,
                    idPatente: 3,
                },
                {
                    idPericia: 18,
                    idPatente: 3,
                },
                {
                    idPericia: 19,
                    idPatente: 3,
                },
                {
                    idPericia: 20,
                    idPatente: 3,
                },
                {
                    idPericia: 21,
                    idPatente: 3,
                },
                {
                    idPericia: 22,
                    idPatente: 3,
                },
                {
                    idPericia: 23,
                    idPatente: 3,
                },
                {
                    idPericia: 24,
                    idPatente: 3,
                },
                {
                    idPericia: 25,
                    idPatente: 3,
                },
                {
                    idPericia: 26,
                    idPatente: 3,
                },
            ]
        }

        localStorage.setItem('dadosFicha', JSON.stringify({ dados: teste }));

        navigate('/ficha-demo');
    }
    
    const vaiDireto = () => {
        navigate('/ficha-demo');
    }

    return (
        <div className={style.teste_interno}>
            <h1>Fichas</h1>
            <ul>
                <li onClick={() => {vaiPraEdicaoFicha()}}>Nova Ficha Editavel</li>

                {typeof localStorage.getItem('dadosFicha') === 'string' ? (
                    <li onClick={() => {vaiDireto()}}>Continuar Ficha Editada</li>
                ) : (<></>)}
                {/* <li>Fichas Prontas
                    <ul>
                        <li onClick={() => {vaiPraFicha()}}>(Rui) Policial 0%</li>
                    </ul>
                    <ul>
                        <li onClick={() => {vaiDireto()}}></li>
                    </ul>
                </li> */}
            </ul>
        </div>
    );
}

export default page;