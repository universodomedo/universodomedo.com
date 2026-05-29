'use client';

import { criaConteiner, criaSaidaConteiner, type SaidaConteiner } from 'Conteineres/_core/criaConteiner';
import { Contexto__PaginaPalcoAdmin__Provider, useContexto__PaginaPalcoAdmin } from 'Contextos/Contexto__PaginaPalcoAdmin/contexto';
import SPA__PaginaPalcoAdmin from './paginas/SPA__PaginaPalcoAdmin/SPA__PaginaPalcoAdmin';

export default function Conteiner__PaginaPalcoAdmin() {
    return (
        <Contexto__PaginaPalcoAdmin__Provider>
            <Conteiner__PaginaPalcoAdmin__Interno />
        </Contexto__PaginaPalcoAdmin__Provider>
    );
};

type PropsConteiner__PaginaPalcoAdmin = ReturnType<typeof useContexto__PaginaPalcoAdmin>;

const Conteiner__PaginaPalcoAdmin__Interno = criaConteiner<PropsConteiner__PaginaPalcoAdmin>({ useEstado, resolveSaida });

function resolveSaida(_props: PropsConteiner__PaginaPalcoAdmin): SaidaConteiner {
    return criaSaidaConteiner(SPA__PaginaPalcoAdmin, {});
};

function useEstado(): PropsConteiner__PaginaPalcoAdmin { return useContexto__PaginaPalcoAdmin(); };
