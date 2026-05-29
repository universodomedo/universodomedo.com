'use client';

import { criaConteiner, criaSaidaConteiner, type SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import { Contexto__PaginaPalco__Provider, useContexto__PaginaPalco } from 'Contextos/Contexto__PaginaPalco/contexto';
import { Contexto__PaginaPalcoAdmin__Provider } from 'Contextos/Contexto__PaginaPalcoAdmin/contexto';
import { Contexto__PaginaPalcoEntrar__Provider } from 'Contextos/Contexto__PaginaPalcoEntrar/contexto';

export default function Conteiner__PaginaPalco() {
    return (
        <Contexto__PaginaPalco__Provider>
            <Conteiner__PaginaPalco__Interno />
        </Contexto__PaginaPalco__Provider>
    );
};

const Conteiner__PaginaPalco__Interno = criaConteiner<PropsConteiner__PaginaPalco>({ useEstado, resolveSaida });

type PropsConteiner__PaginaPalco = ReturnType<typeof useContexto__PaginaPalco>;

function resolveSaida(props: PropsConteiner__PaginaPalco): SaidaConteiner {
    if (props.fluxo === 'ADMIN') return criaSaidaConteiner(Contexto__PaginaPalcoAdmin__Provider, {});

    return criaSaidaConteiner(Contexto__PaginaPalcoEntrar__Provider, {});
};

function useEstado(): PropsConteiner__PaginaPalco { return useContexto__PaginaPalco(); };