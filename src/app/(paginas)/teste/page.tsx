import React from 'react';
import { obtemDiaDaSemanaPorExtensoPorDDS } from 'types-nora-api';

import { janelas } from './data';

export default function Teste() {
    return (
        <>
            <h1>Teste 1</h1>

            {janelas.map(janela => (
                <div key={janela.id} style={{ marginBottom: '1em' }}>
                    <p>Dia da Semana: {obtemDiaDaSemanaPorExtensoPorDDS(janela.dds)}</p>
                    <p>Hora Inicio: {janela.horaInicio}</p>
                    <p>Hora Fim: {janela.horaFim}</p>
                </div>
            ))}

            <hr style={{ width: '100%' }}/>

            <h1>Teste 2</h1>

            <hr style={{ width: '100%' }}/>
        </>
    );
};