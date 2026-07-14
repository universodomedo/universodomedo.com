'use client';

import { criaConteiner, criaSaidaConteiner, type SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import { Contexto__PaginaPalco__Provider, useContexto__PaginaPalco } from 'Contextos/Contexto__PaginaPalco/contexto';
import { Contexto__PaginaPalcoEntrar__Provider, Contexto__PaginaPalcoSemCodigo__Provider } from 'Contextos/Contexto__PaginaPalcoEntrar/contexto';

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
    if (props.fluxo === 'PALCO' && props.codigoPalco !== null) return criaSaidaConteiner(Contexto__PaginaPalcoEntrar__Provider, { codigoPalco: props.codigoPalco });

    return criaSaidaConteiner(Contexto__PaginaPalcoSemCodigo__Provider, {});
};

function useEstado(): PropsConteiner__PaginaPalco { return useContexto__PaginaPalco(); };