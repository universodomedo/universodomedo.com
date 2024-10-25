// #region Imports
import style from './style.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RLJ_Ficha2 } from 'Types/classes.tsx';
import { getDadoFichaPorIdFake } from 'Recursos/DadosFicha.ts';

import { resetaDemo } from "Redux/slices/fichaHelperSlice.ts";
import store from 'Redux/store.ts';

import { useSalaContext } from 'Providers/SalaProvider.tsx';
// #endregion

const page = () => {
    const {salas, criaSala} = useSalaContext();

    const navigate = useNavigate();

    useEffect(() => {
        store.dispatch(resetaDemo());
    }, []);

    const vaiPraEdicaoFicha = () => {
        localStorage.removeItem('dadosFicha');
        navigate('/edita-ficha');
    }

    const vaiPraFicha = (idFake: number) => {
        const teste:RLJ_Ficha2 = getDadoFichaPorIdFake(idFake);

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
                <li>Fichas Prontas
                    <ul>
                        <li onClick={() => {vaiPraFicha(1)}}>Rui (Policial 0%)</li>
                    </ul>
                    <ul>
                        <li onClick={() => {vaiPraFicha(2)}}>Zumbi de Sangue (Criatura Sangue 10%)</li>
                    </ul>
                </li>
            </ul>

            <h1>Salas de Jogo</h1>
            <h2 onClick={criaSala}>Nova Sala</h2>
            {salas.length > 1 ? (
                <>
                    {salas.map((sala, index) => {
                        <h2>Sala 1</h2>
                    })}
                </>
            ): (
                <h2>Não há nenhuma sala disponível</h2>
            )}
        </div>
    );
}

export default page;