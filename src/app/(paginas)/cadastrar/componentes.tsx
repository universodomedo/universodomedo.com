'use client';

import { PAGINAS } from 'types-nora-api';

import { useContextoAutenticacao } from 'Contextos/ContextoAutenticacao/contexto';
import RedirecionadorInterno from 'Componentes/Elementos/RedirecionadorInterno/RedirecionadorInterno';
import { ControladorSlot } from 'Layouts/ControladorSlot';
import { Conteiner__PaginaCadastrar } from 'Conteineres/PaginaCadastrar/conteiner';

export function PaginaAcessar_Client() {
    const { estaAutenticado } = useContextoAutenticacao();

    if (estaAutenticado) return <RedirecionadorInterno pagina={PAGINAS.minhaPagina} />

    return (
        <ControladorSlot pagina={PAGINAS.cadastrar}>
            <Conteiner__PaginaCadastrar />
        </ControladorSlot>
    );
};