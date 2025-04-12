'use client';

import { ControladorSlot } from 'Layouts/ControladorSlot';

import MinhaPaginaComDados from './page-dados.tsx';
import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto.tsx';

export default function PaginaAcessar() {
    return (
        <ControladorSlot pageConfig={{ comCabecalho: false, usuarioObrigatorio: true }}>
            <MinhaPagina/>
        </ControladorSlot>
    );
};

export function MinhaPagina() {
    const { usuarioLogado } = useContextoAutenticacao();

    return <MinhaPaginaComDados dadosMinhaPagina={usuarioLogado!} />
};