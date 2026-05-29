'use client';

import { criaConteiner, criaSaidaConteiner, type SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import { Contexto__PaginaPalcoEntrar__Provider, useContexto__PaginaPalcoEntrar } from 'Contextos/Contexto__PaginaPalcoEntrar/contexto';
import SPA__PaginaPalcoEntrar from './paginas/SPA__PaginaPalcoEntrar/SPA__PaginaPalcoEntrar';

export default function Conteiner__PaginaPalcoEntrar() {
    return (
        <Contexto__PaginaPalcoEntrar__Provider>
            <Conteiner__PaginaPalcoEntrar__Interno />
        </Contexto__PaginaPalcoEntrar__Provider>
    );
};

type PropsConteiner__PaginaPalcoEntrar = ReturnType<typeof useContexto__PaginaPalcoEntrar>;

const Conteiner__PaginaPalcoEntrar__Interno = criaConteiner<PropsConteiner__PaginaPalcoEntrar>({ useEstado, resolveSaida });

function resolveSaida(_props: PropsConteiner__PaginaPalcoEntrar): SaidaConteiner {
    return criaSaidaConteiner(SPA__PaginaPalcoEntrar, {});
};

function useEstado(): PropsConteiner__PaginaPalcoEntrar { return useContexto__PaginaPalcoEntrar(); };
